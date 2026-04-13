import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 5,
          marginTop: 15,
        }}
      >
        {/* <Ionicons name='pin-sharp' size={20} color='red' /> */}
        <TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#008E6D', borderRadius: 50, padding: 8 }}
        >
          <Ionicons name="settings" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 25,
          fontWeight: '700',
          color: '#008E6D',
          marginTop: 20,
        }}
      >
        Venue Login
      </Text>

      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name='happy-sharp' size={30} color='#012D2E' />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to manage your venue
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="youremailhere@gmail.com"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            {/* Lock Icon */}
            <View style={styles.lockIconContainer}>
              <View style={styles.lockShackle} />
              <View style={styles.lockBody} />
            </View>

            <TextInput
              style={styles.passwordInput}
              placeholder="************"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
            />

            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <View style={styles.eyeIcon}>
                <View style={styles.eyeOuter} />
                <View style={styles.eyeInner} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('BottomTabs')}
            style={styles.signInButton}
          >
            <Text style={styles.signInButtonText}>Sign-In</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Or Continue with</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBox}>
            <Ionicons name="logo-google" color="#012D2E" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBox}>
            <Ionicons name="logo-apple" color="#012D2E" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBox}>
            <Ionicons name="logo-facebook" color="#012D2E" size={25} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
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

  header: { alignItems:'center', marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.4,
    color: '#012D2E',
  },
  subtitle: { fontSize: 14, marginTop: 6, color: '#666' },

  form: { marginVertical: 12 },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 12,
    color: '#012D2E',
  },

  input: {
    height: 40,
    borderRadius: 50,
    paddingHorizontal: 20,
    fontSize: 14,
    backgroundColor: '#f2f2f2',
    color: '#000',
  },

  passwordContainer: {
    height: 40,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },

  signInButton: {
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#008E6D',
  },

  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#777',
  },

  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: '#777',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 15,
  },

  socialBox: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    color: '#012D2E',
  },

  signUpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#008E6D',
  },

  lockIconContainer: {
    width: 20,
    alignItems: 'center',
  },

  lockShackle: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: -2,
    borderColor: '#666',
  },

  lockBody: {
    width: 12,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#666',
  },

  eyeIcon: {
    width: 20,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyeOuter: {
    width: 20,
    height: 10,
    borderWidth: 2,
    borderRadius: 6,
    position: 'absolute',
    borderColor: '#666',
  },

  eyeInner: {
    width: 5,
    height: 5,
    borderRadius: 50,
    backgroundColor: '#666',
  },
});
