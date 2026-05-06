import React, { useEffect, useState } from 'react';
import {
  Image, StatusBar, StyleSheet, Text,
  TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { getUser, clearAuth } from '../store/authStore';
import { AuthUser } from '../services/authService';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user?.email;

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await clearAuth();
    navigation.reset({ index: 0, routes: [{ name: 'BottomTabs' }] });
  };

  const featureData = [
    { title: 'Saved Events', metaText: 'Your favourite events', tipIcon: 'heart', screen: 'Savedevents' },
    { title: 'Notifications', metaText: 'Manage your alerts', tipIcon: 'notifications', screen: 'NotificationSettings' },
    { title: 'Location', metaText: 'Belfast, Northern Ireland', tipIcon: 'location', screen: 'Locationscreen' },
    { title: 'Share App', metaText: "Tell friends about What's On", tipIcon: 'share-sharp', screen: '' },
    { title: 'Help & Support', metaText: 'FAQs and contact', tipIcon: 'help-outline', screen: 'HelpSupport' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#008E6D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 15 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}
          style={{ backgroundColor: '#008E6D', borderRadius: 50, padding: 8 }}>
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: '40%' }}>
          <Text style={{ fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 20 }}>Profile</Text>

          {isAuthenticated ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, marginTop: 12 }}>
                <Image
                  source={user?.avatar ? { uri: user.avatar } : require('../assets/onboard3.png')}
                  style={styles.profilepic}
                />
                <View>
                  <Text style={styles.fullname}>{user?.fullName || 'Your Name'}</Text>
                  <Text style={styles.userdata}>{user?.email || 'your@email.com'}</Text>
                </View>
              </View>

              <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate('Editprofile')}
                style={{ backgroundColor: '#008E6D', padding: 10, borderRadius: 50, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
                <Ionicons name="pencil" size={15} color="#fff" />
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>Edit Profile</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 }}>
                <TouchableOpacity onPress={() => navigation.navigate('ManageEvents')}
                  activeOpacity={0.75} style={styles.logincardbtn}>
                  <Ionicons name="calendar-outline" size={25} color="#ffffffde" />
                  <Text style={styles.btntext}>Manage Your Events</Text>
                </TouchableOpacity>
                {user?.role === 'admin' && (
                  <TouchableOpacity onPress={() => navigation.navigate('Adminpanel')}
                    activeOpacity={0.75} style={styles.logincardbtn}>
                    <Ionicons name="tv-sharp" size={25} color="#ffffffde" />
                    <Text style={styles.btntext}>Admin Panel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <>
              <View style={styles.guestCard}>
                <Image source={require('../assets/onboard3.png')} style={styles.profilepic} />
                <Text style={styles.guestTitle}>Welcome to What's On</Text>
                <Text style={styles.guestText}>Sign in to save events, manage your event submissions, and update your profile.</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Loginscreen')} activeOpacity={0.75} style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Registerscreen')} activeOpacity={0.75} style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {featureData.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tipCard}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <View style={styles.tipicon}>
                <Ionicons name={item.tipIcon as any} size={20} color="#ffffffde" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.tipTime}>{item.metaText}</Text>
              </View>
              <Text style={styles.arrowIcon}>〉</Text>
            </TouchableOpacity>
          ))}

          {isAuthenticated && (
            <TouchableOpacity onPress={handleLogout}
              style={{ backgroundColor: '#ff4444', padding: 14, borderRadius: 50, alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>Logout</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profilepic: { width: 75, height: 75, borderRadius: 50, borderWidth: 1 },
  fullname: { fontSize: 18, fontWeight: '600', letterSpacing: 0.75 },
  userdata: { fontSize: 12, fontWeight: '500', letterSpacing: 0.66, color: '#555' },
  logincardbtn: { backgroundColor: '#012D2E', alignItems: 'center', padding: 20, borderRadius: 8, width: '45%' },
  btntext: { fontSize: 14, fontWeight: '600', color: '#ffffffde', marginVertical: 3 },
  guestCard: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 18, borderRadius: 18, backgroundColor: '#f7faf9', borderWidth: 1, borderColor: '#e6efec', marginTop: 12 },
  guestTitle: { fontSize: 18, fontWeight: '800', color: '#012D2E', marginTop: 10 },
  guestText: { fontSize: 13, color: '#556', textAlign: 'center', marginTop: 6, lineHeight: 19 },
  primaryBtn: { backgroundColor: '#008E6D', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: '#d8e2df' },
  secondaryBtnText: { color: '#012D2E', fontWeight: '800' },
  tipCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, marginVertical: 10, borderWidth: 1, borderColor: '#ddd' },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#012D2E' },
  tipTime: { fontSize: 10, marginTop: 2, color: '#012d2ede' },
  arrowIcon: { fontSize: 12, color: '#888' },
  tipicon: { borderRadius: 50, backgroundColor: '#008E6D', padding: 8, marginRight: 7 },
});
