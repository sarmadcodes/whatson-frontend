import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomBottomBar from '../components/CustomBottomBar';
import DiscoverScreen from '../screens/DiscoverScreen';
import MapsScreen from '../screens/MapsScreen';
import BrowseScreen from '../screens/BrowseScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomBottomBar {...props} />}
    >

      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Maps" component={MapsScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

    </Tab.Navigator>
  );
};

export default BottomTabs;
