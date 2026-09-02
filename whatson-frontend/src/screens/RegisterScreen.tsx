import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, StatusBar, ScrollView,
  ActivityIndicator, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { registerUser } from '../services/authService';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ fullName: fullName.trim(), email: email.trim().toLowerCase(), password });
      Alert.alert(
        'Account Created!',
        "Welcome to What's On! Please log in to continue.",
        [{ text: 'Login Now', onPress: () => navigation.replace('Loginscreen') }]
      );
    } catch (error: any) {
      const isNetworkIssue = error?.code === 'ECONNABORTED' || error?.message === 'Network Error';
      const message = isNetworkIssue
        ? 'Cannot reach server. Check backend is running and API URL in src/config/api.ts is correct for your emulator/device.'
        : error?.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5, marginTop: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 20 }}>Register</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Image source={require('../assets/icon1.png')} style={styles.iconImage} />
            </View>
            <Text style={styles.title}>Join What's On</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="youremail@gmail.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Minimum 6 characters"
                placeholderTextColor="#999"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              style={[styles.signInButton, loading && { opacity: 0.7 }]}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Loginscreen')}>
              <Text style={styles.signUpText}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 15, marginTop: 15 },
  title: { fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5, color: '#012D2E', marginTop: 10 },
  subtitle: { fontSize: 14, marginTop: 6, color: '#666' },
  form: { marginVertical: 15 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 10, marginTop: 15, color: '#000' },
  input: { height: 45, borderRadius: 50, paddingHorizontal: 20, fontSize: 14, backgroundColor: '#f2f2f2', color: '#000' },
  passwordContainer: { height: 45, borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#f2f2f2' },
  passwordInput: { flex: 1, fontSize: 14, color: '#000' },
  signInButton: { height: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#008E6D' },
  signInButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  footerText: { fontSize: 12, color: '#666' },
  signUpText: { fontSize: 13, fontWeight: '700', color: '#008E6D' },
  iconWrapper: { width: 55, height: 55, borderRadius: 10, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#74C33C' },
  iconImage: { width: '90%', height: '90%', resizeMode: 'contain' },
});
