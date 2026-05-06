import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { hasSeenOnboarding } from '../store/authStore';

const SplashScreen = ({ navigation }: { navigation: any }) => {

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(async () => {
      const seen = await hasSeenOnboarding();
      if (!mounted) return;
      navigation.replace(seen ? 'BottomTabs' : 'Onboarding');
    }, 1800);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
        <StatusBar barStyle='light-content' backgroundColor='#008E6D' />
      <Image
        source={require('../assets/logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008E6D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 180,
  },
});
