import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getToken, saveAuth } from '../store/authStore';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = Math.min(100, width * 0.24);

const EditProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-3d-illustration-avatar-profile-man-png-image_9945226.png'
  );

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    website: '',
  });
  const [saving, setSaving] = useState(false);
  const MAX_BIO = 200;

  const toggleEdit = async () => {
    if (isEditing) {
      await saveProfile();
    } else {
      setIsEditing(true);
    }
  };

  const pickImage = () => {
    if (!isEditing) return;
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (!response.didCancel && response.assets?.length) {
        setProfileImage(response.assets[0].uri!);
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        const user = res.data.user;
        setFormData({
          fullName: user.fullName || '',
          username: user.username || '',
          bio: user.bio || '',
          website: user.website || '',
        });
        if (user.avatar) setProfileImage(user.avatar);
      } catch (err: any) {
        console.warn('Failed to load profile', err?.message || err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const uploadImageToServer = async (uri: string) => {
    if (!uri || uri.startsWith('http')) return uri;
    const token = await getToken();
    const form = new FormData();
    const filename = uri.split('/').pop();
    const match = filename?.match(/\.(\w+)$/);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    form.append('file', { uri, name: filename, type } as any);
    const res = await fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      body: form,
    });
    const data = await res.json();
    if (data?.url) return data.url;
    throw new Error('Upload failed');
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let avatarUrl = profileImage;
      if (profileImage && !profileImage.startsWith('http')) {
        avatarUrl = await uploadImageToServer(profileImage);
      }
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      const payload = {
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        website: formData.website,
        avatar: avatarUrl,
      };
      const res = await axios.put(`${API_BASE_URL}/users/me`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = res.data.user;
      await saveAuth(token, updated);
      setFormData({
        fullName: updated.fullName || '',
        username: updated.username || '',
        bio: updated.bio || '',
        website: updated.website || '',
      });
      if (updated.avatar) setProfileImage(updated.avatar);
      setIsEditing(false);
    } catch (err: any) {
      console.warn('Save profile failed', err?.message || err);
    } finally {
      setSaving(false);
    }
  };

  const handleBioChange = (text: string) => {
    if (text.length <= MAX_BIO) setFormData(prev => ({ ...prev, bio: text }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={[styles.actionBtn, saving && { opacity: 0.7 }]} onPress={toggleEdit} disabled={saving}>
              <Text style={styles.actionBtnText}>{isEditing ? (saving ? 'Saving…' : 'Save') : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            {/* Tap avatar to preview; tap camera badge to pick */}
            <View style={styles.avatarWrapper}>
              <TouchableOpacity onPress={() => setPreviewVisible(true)} activeOpacity={0.85}>
                <Image
                  source={{ uri: profileImage ? `${profileImage}?t=${Date.now()}` : profileImage }}
                  style={[styles.avatarImage, !isEditing && { opacity: 0.75 }]}
                />
              </TouchableOpacity>

              {/* Camera badge — positioned relative to the avatar circle */}
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 13 }}>📷</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.editPhotoText, { color: isEditing ? '#008E6D' : '#999' }]}>
              {isEditing ? 'Tap camera to change photo' : 'Tap Edit to update photo'}
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, !isEditing && styles.disabledLabel]}>Full Name</Text>
            <View style={[styles.pillInput, { backgroundColor: isEditing ? '#f5f5f5' : '#eee' }]}>
              <TextInput
                style={styles.input}
                editable={isEditing}
                placeholder="Your Name"
                placeholderTextColor="#aaa"
                value={formData.fullName}
                onChangeText={t => setFormData(prev => ({ ...prev, fullName: t }))}
              />
            </View>
          </View>

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, !isEditing && styles.disabledLabel]}>User Name</Text>
            <View style={[styles.pillInput, { backgroundColor: isEditing ? '#f5f5f5' : '#eee' }]}>
              <TextInput
                style={styles.input}
                editable={isEditing}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={formData.username}
                onChangeText={t => setFormData(prev => ({ ...prev, username: t }))}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, !isEditing && styles.disabledLabel]}>Bio</Text>
            <View style={[styles.bioBox, { backgroundColor: isEditing ? '#f5f5f5' : '#eee' }]}>
              <TextInput
                style={styles.bioInput}
                multiline
                placeholder="Tell us about yourself…"
                placeholderTextColor="#aaa"
                value={formData.bio}
                onChangeText={handleBioChange}
                editable={isEditing}
                maxLength={MAX_BIO}
                textAlignVertical="top"
              />
            </View>
            <Text style={[styles.charCount, formData.bio.length >= MAX_BIO && { color: '#e53e3e' }]}>
              {formData.bio.length} / {MAX_BIO}
            </Text>
          </View>

          {/* Website */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, !isEditing && styles.disabledLabel]}>Website</Text>
            <View style={[styles.pillInput, { backgroundColor: isEditing ? '#f5f5f5' : '#eee' }]}>
              <TextInput
                style={styles.input}
                editable={isEditing}
                placeholder="https://yourwebsite.com"
                placeholderTextColor="#aaa"
                value={formData.website}
                onChangeText={t => setFormData(prev => ({ ...prev, website: t }))}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Full-image preview modal */}
      <Modal visible={previewVisible} transparent animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
        <TouchableOpacity style={styles.previewOverlay} onPress={() => setPreviewVisible(false)} activeOpacity={1}>
          <Image source={{ uri: profileImage }} style={styles.previewImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  actionBtn: {
    paddingHorizontal: 22, paddingVertical: 8,
    borderRadius: 50, backgroundColor: '#008E6D',
  },
  actionBtnText: { fontWeight: 'bold', fontSize: 14, color: '#fff' },

  // Avatar centered with badge positioned relative to the circle
  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { position: 'relative', width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#000',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30, height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editPhotoText: { fontWeight: '600', fontSize: 13, marginTop: 10 },

  inputGroup: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#000' },
  disabledLabel: { opacity: 0.45 },

  pillInput: {
    borderRadius: 50,
    height: 46,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: { fontSize: 15, color: '#000', padding: 0 },

  bioBox: { borderRadius: 12, padding: 14 },
  bioInput: {
    fontSize: 14, lineHeight: 20, color: '#000',
    minHeight: Platform.OS === 'ios' ? 110 : 100,
  },
  charCount: { fontSize: 12, marginTop: 5, color: '#888', textAlign: 'right' },

  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: { width: width * 0.9, height: width * 0.9, borderRadius: 12 },
});