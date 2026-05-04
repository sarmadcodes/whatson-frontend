import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getToken } from './src/store/authStore';

import SplashScreen from './src/screens/SplashScreen';
import Onboarding from './src/screens/Onboarding';
import BottombarTabs from './src/navigation/BottomBarTabs';
import NotificationsScreen from './src/screens/NotificationsScreen';
import NotificationSettings from './src/screens/NotificationSettings';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AdminPanel from './src/screens/AdminPanel';
import EditProfile from './src/screens/EditProfile';
import InnerEventScreen from './src/screens/InnerEventScreen';
import CateDetailScreen from './src/screens/CateDetailScreen';
import EventGroupScreen from './src/screens/EventGroupScreen';
import SavedEvents from './src/screens/SavedEvents';
import LocationScreen from './src/screens/LocationScreen';
import HelpSupport from './src/screens/HelpSupport';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#008E6D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="BottomTabs" component={BottombarTabs} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
            <Stack.Screen name="Loginscreen" component={LoginScreen} />
            <Stack.Screen name="Registerscreen" component={RegisterScreen} />
            <Stack.Screen name="Adminpanel" component={AdminPanel} />
            <Stack.Screen name="Editprofile" component={EditProfile} />
            <Stack.Screen name="Innerevetscreen" component={InnerEventScreen} />
            <Stack.Screen name="Categorydetails" component={CateDetailScreen} />
            <Stack.Screen name="EventGroup" component={EventGroupScreen} />
            <Stack.Screen name="Savedevents" component={SavedEvents} />
            <Stack.Screen name="Locationscreen" component={LocationScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupport} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splashscreen" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Loginscreen" component={LoginScreen} />
            <Stack.Screen name="Registerscreen" component={RegisterScreen} />
            <Stack.Screen name="BottomTabs" component={BottombarTabs} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
            <Stack.Screen name="Adminpanel" component={AdminPanel} />
            <Stack.Screen name="Editprofile" component={EditProfile} />
            <Stack.Screen name="Innerevetscreen" component={InnerEventScreen} />
            <Stack.Screen name="Categorydetails" component={CateDetailScreen} />
            <Stack.Screen name="EventGroup" component={EventGroupScreen} />
            <Stack.Screen name="Savedevents" component={SavedEvents} />
            <Stack.Screen name="Locationscreen" component={LocationScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupport} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
