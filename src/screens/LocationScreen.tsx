import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const LocationScreen = ({ navigation }) => {
  const cities = ['Liverpool ', 'Belfast', 'London', 'Westminster', 'Leicester', 'Oxford'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Shared Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifCircle}
        >
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Location</Text>
        <Text style={styles.screenSubtitle}>Select your current region</Text>

        <TouchableOpacity activeOpacity={0.8} style={styles.currentLocationBtn}>
          <Ionicons name="navigate" size={20} color="white" />
          <Text style={styles.btnText}>Use My Current Location</Text>
        </TouchableOpacity>

        <View style={styles.searchBarPlaceholder}>
          <Ionicons name="search" size={18} color="#888" />
          <Text style={styles.placeholderText}>Search for a city...</Text>
        </View>

        <Text style={styles.sectionTitle}>Popular Regions</Text>
        {cities.map((city, index) => (
          <TouchableOpacity key={index} style={styles.cityRow}>
            <Text style={styles.cityName}>{city}</Text>
            <Ionicons name="chevron-forward" size={18} color="#008E6D" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  notifCircle: {
    backgroundColor: '#008E6D',
    borderRadius: 50,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#008E6D',
    marginTop: 20,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  currentLocationBtn: {
    backgroundColor: '#008E6D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
    gap: 10,
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  searchBarPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  placeholderText: {
    color: '#888',
    marginLeft: 10,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#012D2E',
    marginTop: 30,
    marginBottom: 10,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cityName: {
    fontSize: 16,
    color: '#012D2E',
    fontWeight: '500',
  },
});

export default LocationScreen;