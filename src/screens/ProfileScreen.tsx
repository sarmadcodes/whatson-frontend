import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '../components/Icon';
import { getUser } from '../store/authStore';
import { AuthUser } from '../services/authService';

const { width } = Dimensions.get('window');

// Action buttons: 2 per row with gap, never overflow
const ACTION_BTN_WIDTH = (width - 30 - 10) / 2; // padding 15*2, gap 10

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user?.email;

  const loadUser = async () => {
    const storedUser = await getUser();
    setUser(storedUser);
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
    const unsubscribe = navigation.addListener('focus', () => { loadUser(); });
    return unsubscribe;
  }, [navigation]);

  const featureData = useMemo(() => [
    { id: '1', title: 'Saved Events', sub: 'Your favourite events', icon: 'heart', screen: 'Savedevents' },
    { id: '2', title: 'Notifications', sub: 'Manage your alerts', icon: 'notifications', screen: 'NotificationSettings' },
    { id: '3', title: 'Location', sub: 'Belfast, Northern Ireland', icon: 'location', screen: 'Locationscreen' },
    { id: '4', title: 'Share App', sub: "Tell friends about What's On", icon: 'share-sharp', screen: '' },
    { id: '5', title: 'Help & Support', sub: 'FAQs and contact', icon: 'help-outline', screen: 'HelpSupport' },
  ], []);

  const displayName = user?.fullName || 'Guest User';
  const handleName = user?.username
    ? `@${user.username}`
    : user?.email ? `@${user.email.split('@')[0]}` : '@guest';
  const profileBio = user?.bio || (isAuthenticated ? 'No bio available' : 'Please login to see your profile');
  const profileWebsite = user?.website || '';
  const profileImage = user?.avatar ? { uri: user.avatar } : require('../assets/onboard3.png');

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008E6D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsCircle} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="notifications" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.mainTitle}>Profile</Text>

        {isAuthenticated ? (
          <>
            {/* User section */}
            <View style={styles.userSection}>
              <View style={styles.avatarContainer}>
                <Image source={profileImage} style={styles.avatarImage} />
                <TouchableOpacity
                  style={styles.cameraBadge}
                  onPress={() => navigation.navigate('Editprofile', { userName: user?.username || '' })}
                >
                  <Icon name="camera" size={14} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.userText}>
                <Text style={styles.userNameDisplay} numberOfLines={1}>{displayName}</Text>
                <Text style={styles.userHandleDisplay} numberOfLines={1}>{handleName}</Text>
                <Text style={styles.userBioDisplay}>{profileBio}</Text>
                {profileWebsite ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(profileWebsite.startsWith('http') ? profileWebsite : `https://${profileWebsite}`)}
                  >
                    <Text style={styles.websiteLink} numberOfLines={1}>{profileWebsite}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Edit button — full width minus padding */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('Editprofile', { userName: user?.username || '' })}
            >
              <Icon name="pencil" size={18} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Action row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.darkActionButton, { width: ACTION_BTN_WIDTH }]}
                onPress={() => navigation.navigate('ManageEvents')}
              >
                <Icon name="calendar-outline" size={25} color="#fff" />
                <Text style={styles.actionText}>Manage Your Events</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.darkActionButton, { width: ACTION_BTN_WIDTH }]}
                onPress={() => navigation.navigate('Adminpanel')}
              >
                <Icon name="tv-sharp" size={25} color="#fff" />
                <Text style={styles.actionText}>Admin Panel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.guestCard}>
            <Image source={require('../assets/onboard3.png')} style={styles.avatarImage} />
            <Text style={styles.guestTitle}>Welcome to What's On</Text>
            <Text style={styles.guestText}>
              Sign in to save events, manage your event submissions, and update your profile.
            </Text>
            <View style={styles.guestActions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Loginscreen')}
                activeOpacity={0.75}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Registerscreen')}
                activeOpacity={0.75}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Options list */}
        <View style={styles.optionsList}>
          {featureData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
              activeOpacity={0.75}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconCircle}>
                  <Icon name={item.icon as any} size={18} color="#fff" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{item.title}</Text>
                  <Text style={styles.optionSub}>{item.sub}</Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={16} color="#c4cdd2" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backText: { fontSize: 18, color: '#012D2E', fontWeight: 'bold' },
  settingsCircle: {
    width: 42, height: 42, backgroundColor: '#008E6D',
    borderRadius: 21, justifyContent: 'center', alignItems: 'center',
  },
  mainTitle: { fontSize: 35, fontWeight: 'bold', color: '#008E6D', marginTop: 20, marginBottom: 25 },
  userSection: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 25 },
  avatarContainer: { position: 'relative', flexShrink: 0 },
  avatarImage: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#008E6D' },
  cameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#74C33C',
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  userText: { marginLeft: 16, flex: 1, minWidth: 0 },
  userNameDisplay: { fontSize: 22, fontWeight: 'bold', color: '#001D1D' },
  userHandleDisplay: { fontSize: 14, color: '#666', marginTop: 2, marginBottom: 4 },
  userBioDisplay: { fontSize: 13, color: '#333', marginTop: 6, lineHeight: 19 },
  websiteLink: { fontSize: 13, color: '#008E6D', marginTop: 5, textDecorationLine: 'underline' },
  editButton: {
    backgroundColor: '#008E6D',
    flexDirection: 'row',
    height: 52,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
    // Full width of the content area — no hardcoded width * multiplier needed
  },
  editButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, gap: 10 },
  darkActionButton: {
    backgroundColor: '#012D2E',
    minHeight: 95,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
    gap: 8,
  },
  actionText: { color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  guestCard: {
    alignItems: 'center',
    paddingVertical: 20, paddingHorizontal: 18,
    borderRadius: 18, backgroundColor: '#f7faf9',
    borderWidth: 1, borderColor: '#e6efec', marginTop: 12,
  },
  guestTitle: { fontSize: 18, fontWeight: '800', color: '#012D2E', marginTop: 10 },
  guestText: { fontSize: 13, color: '#556', textAlign: 'center', marginTop: 6, lineHeight: 19 },
  guestActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryBtn: { backgroundColor: '#008E6D', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: {
    backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 999, borderWidth: 1, borderColor: '#d8e2df',
  },
  secondaryBtnText: { color: '#012D2E', fontWeight: '800' },
  optionsList: { marginTop: 4 },
  optionItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', padding: 12, borderRadius: 15, marginBottom: 10,
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: {
    width: 38, height: 38, backgroundColor: '#008E6D',
    borderRadius: 19, justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  optionTextContainer: { marginLeft: 14, flex: 1, minWidth: 0 },
  optionTitle: { fontSize: 14, fontWeight: 'bold', color: '#001D1D' },
  optionSub: { fontSize: 11, color: '#666', marginTop: 2 },
});