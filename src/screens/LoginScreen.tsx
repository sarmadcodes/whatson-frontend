import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, StatusBar, ActivityIndicator,
  Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloseIcon } from '../components/SvgIcons';
import Icon from '../components/Icon';
import { loginUser } from '../services/authService';
import { saveAuth } from '../store/authStore';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email: email.trim().toLowerCase(), password });
      await saveAuth(response.token, response.user);
      navigation.reset({ index: 0, routes: [{ name: 'BottomTabs' }] });
    } catch (error: any) {
      const isNetworkIssue = error?.code === 'ECONNABORTED' || error?.message === 'Network Error';
      const message = isNetworkIssue
        ? 'Cannot reach server. Check backend is running and API URL in src/config/api.ts is correct for your emulator/device.'
        : error?.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5, marginTop: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 20 }}>Login</Text>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Image source={require('../assets/icon1.png')} style={styles.iconImage} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
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
              placeholder="Your password"
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
            onPress={handleLogin}
            style={[styles.signInButton, loading && { opacity: 0.7 }]}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registerscreen')}>
            <Text style={styles.signUpText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', letterSpacing: 0.4, color: '#012D2E', marginTop: 10 },
  subtitle: { fontSize: 14, marginTop: 6, color: '#666' },
  form: { marginVertical: 12 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 10, marginTop: 12, color: '#012D2E' },
  input: { height: 45, borderRadius: 50, paddingHorizontal: 20, fontSize: 14, backgroundColor: '#f2f2f2', color: '#000' },
  passwordContainer: { height: 45, borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#f2f2f2' },
  passwordInput: { flex: 1, fontSize: 14, color: '#000' },
  signInButton: { height: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: '#008E6D' },
  signInButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 12, color: '#012D2E' },
  signUpText: { fontSize: 13, fontWeight: '700', color: '#008E6D' },
  iconWrapper: { width: 55, height: 55, borderRadius: 10, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#74C33C' },
  iconImage: { width: '90%', height: '90%', resizeMode: 'contain' },
});
