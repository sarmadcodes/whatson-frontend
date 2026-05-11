import React, { useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from '../components/Icon';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';

const LocationScreen = ({ navigation }: { navigation: { goBack: () => void; navigate: (screen: string) => void } }) => {
  const [locating, setLocating] = useState(false);
  const placesRef = useRef(null);

  // ─── GPS: Use Current Location ────────────────────────────────────────────
  const handleUseCurrentLocation = async () => {
    Alert.alert(
      'GPS Unavailable',
      'Please search for your city below.',
      [{ text: 'OK' }]
    );
  };

  // ─── Places Autocomplete: user picks a place ──────────────────────────────
  const handlePlaceSelected = async (data: any, details: any) => {
    if (!details) return;

    const lat = details.geometry?.location?.lat;
    const lng = details.geometry?.location?.lng;
    // Extract city name from address components
    const components: any[] = details.address_components || [];
    const cityComp = components.find((c) =>
      c.types.includes('postal_town') ||
      c.types.includes('locality') ||
      c.types.includes('administrative_area_level_2')
    );
    const cityName = cityComp?.long_name || data.description || details.name;

    await AsyncStorage.setItem('user_city', cityName);
    if (lat && lng) {
      await AsyncStorage.setItem('user_lat', String(lat));
      await AsyncStorage.setItem('user_lng', String(lng));
    } else {
      await AsyncStorage.removeItem('user_lat');
      await AsyncStorage.removeItem('user_lng');
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifCircle}
        >
          <Icon name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Location</Text>
        <Text style={styles.screenSubtitle}>Search a city or use your GPS</Text>

        {/* Use Current Location button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.currentLocationBtn, locating && styles.currentLocationBtnDisabled]}
          onPress={handleUseCurrentLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Icon name="navigate" size={20} color="white" />
          )}
          <Text style={styles.btnText}>
            {locating ? 'Locating…' : 'Use My Current Location'}
          </Text>
        </TouchableOpacity>

        {/* Google Places Search bar */}
        <GooglePlacesAutocomplete
          ref={placesRef}
          placeholder="Search for a city or venue…"
          fetchDetails
          onPress={handlePlaceSelected}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
            types: '(cities)',
          }}
          keyboardShouldPersistTaps="handled"
          listViewDisplayed="auto"
          enablePoweredByContainer={false}
          debounce={300}
          styles={{
            container: styles.autocompleteContainer,
            textInput: styles.autocompleteInput,
            listView: styles.autocompleteList,
            row: styles.autocompleteRow,
            description: styles.autocompleteDescription,
            separator: styles.autocompleteSeparator,
            poweredContainer: { display: 'none' },
          }}
          textInputProps={{
            placeholderTextColor: '#888',
            clearButtonMode: 'while-editing',
          }}
          renderLeftButton={() => (
            <View style={styles.searchIconWrap}>
              <Icon name="search" size={18} color="#888" />
            </View>
          )}
        />
      </View>
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
    marginBottom: 20,
  },
  currentLocationBtn: {
    backgroundColor: '#008E6D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 50,
    marginBottom: 20,
    gap: 10,
  },
  currentLocationBtnDisabled: {
    backgroundColor: '#5aab92',
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  autocompleteContainer: {
    flex: 0,
    zIndex: 10,
  },
  autocompleteInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    fontSize: 14,
    color: '#111',
    height: 48,
    paddingLeft: 40,
  },
  autocompleteList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    zIndex: 20,
  },
  autocompleteRow: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  autocompleteDescription: {
    fontSize: 14,
    color: '#012D2E',
    fontWeight: '500',
  },
  autocompleteSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  searchIconWrap: {
    position: 'absolute',
    left: 12,
    top: 15,
    zIndex: 5,
  },
});

export default LocationScreen;