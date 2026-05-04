import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';

const EditProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-3d-illustration-avatar-profile-man-png-image_9945226.png'
  );

  const [formData, setFormData] = useState({
    userName: '',
    lastName: '',
    bio:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    website: '',
  });

  const MAX_BIO = 200;

  const toggleEdit = () => setIsEditing(!isEditing);

  const pickImage = () => {
    if (!isEditing) return;
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      response => {
        if (!response.didCancel && response.assets?.length) {
          setProfileImage(response.assets[0].uri);
        }
      }
    );
  };

  const handleBioChange = text => {
    if (text.length <= MAX_BIO) setFormData({ ...formData, bio: text });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 40 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={toggleEdit}
            >
              <Text style={styles.actionBtnText}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={() => setPreviewVisible(true)}>
              <View style={[styles.avatarCircle, { opacity: isEditing ? 1 : 0.6 }]}>
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 14 }}>{'📷'}</Text>
            </TouchableOpacity>

            <Text style={[styles.editPhotoText, { color: isEditing ? '#008E6D' : '#999' }]}>
              Edit Picture or Avatar
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, !isEditing && styles.disabledLabel]}>
              Full Name
            </Text>
            <View style={[styles.pillInputContainer, { backgroundColor: isEditing ? '#f5f5f5' : '#eee' }]}>
              <TextInput
                style={styles.input}
                editable={isEditing}
                placeholder="Your Name"
                placeholderTextColor="#aaa"
                value={formData.userName}
                onChangeText={t => setFormData({ ...formData, userName: t })}
              />
            </View>
          </View>

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, !isEditing && styles.disabledLabel]}>
              User Name
            </Text>
            <View style={[styles.pillInputContainer, { backgroundColor: isEditing ? '#f5f5f5' : '#eee' }]}>
              <TextInput
                style={styles.input}
                editable={isEditing}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={formData.lastName}
                onChangeText={t => setFormData({ ...formData, lastName: t })}
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
                placeholder="Tell us about yourself..."
                placeholderTextColor="#aaa"
                value={formData.bio}
                onChangeText={handleBioChange}
                editable={isEditing && formData.bio.length < MAX_BIO}
                maxLength={MAX_BIO}
                textAlignVertical="top"
              />
            </View>
            <Text style={[styles.charCount, formData.bio.length >= MAX_BIO && { color: 'red' }]}>
              {formData.bio.length} / {MAX_BIO}
            </Text>
          </View>

          {/* Website */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, !isEditing && styles.disabledLabel]}>
              Website
            </Text>
            <View style={[styles.pillInputContainer, { backgroundColor: isEditing ? '#f5f5f5' : '#eee' }]}>
              <TextInput
                style={styles.input}
                editable={isEditing}
                placeholder="https://yourwebsite.com"
                placeholderTextColor="#aaa"
                value={formData.website}
                onChangeText={t => setFormData({ ...formData, website: t })}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal visible={previewVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.previewContainer}
          onPress={() => setPreviewVisible(false)}
        >
          <Image source={{ uri: profileImage }} style={styles.previewImage} />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  actionBtn: { paddingHorizontal: 20, paddingVertical: 7, borderRadius: 50, backgroundColor: '#008E6D' },
  actionBtnText: { fontWeight: 'bold', fontSize: 14, color: '#fff' },

  avatarContainer: { alignItems: 'center', marginVertical: 15 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#000' },
  avatarImage: { width: '100%', height: '100%' },
  cameraBadge: { position: 'absolute', bottom: 25, right: 140, width: 30, height: 30, borderRadius: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' },
  editPhotoText: { fontWeight: '600', fontSize: 14, marginTop: 8 },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 10, marginLeft: 5, color: '#000' },
  disabledLabel: { opacity: 0.5, color: '#999' },

  pillInputContainer: { borderRadius: 50, height: 45, paddingHorizontal: 15, justifyContent: 'center' },
  input: { fontSize: 15, color: '#000' },

  bioBox: { borderRadius: 10, minHeight: 160, padding: 15 },
  bioInput: { fontSize: 14, lineHeight: 20, color: '#000' },
  charCount: { fontSize: 12, marginTop: 6, color: '#666' },

  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  previewImage: { width: '90%', height: '70%', resizeMode: 'contain', borderRadius: 12 },
});

export default EditProfile;