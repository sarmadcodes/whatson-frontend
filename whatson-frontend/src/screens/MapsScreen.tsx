import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Icon from '../components/Icon';
import { API_BASE_URL } from '../config/api';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';
import { MapErrorBoundary } from '../components/MapErrorBoundary';

const { width, height } = Dimensions.get('window');

// Map height: ~30% of screen, clamped between 180–300
const MAP_HEIGHT = Math.min(300, Math.max(180, height * 0.28));

const FALLBACK_REGION: Region = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

type EventItem = {
  _id: string;
  title: string;
  venue: string;
  city?: string;
  date?: string;
  time?: string;
  price?: string;
  isFree?: boolean;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const MapsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [disableNativeMap, setDisableNativeMap] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);

  const openExternalMap = () => {
    const url = userLocation
      ? `https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`
      : 'https://www.google.com/maps';
    Linking.openURL(url).catch(err => console.error('Failed to open external map:', err));
  };

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return events;
    return events.filter(event =>
      [event.title, event.venue, event.city, event.date, event.time]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(query))
    );
  }, [events, searchQuery]);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) setDisableNativeMap(true);
    // Load events by city from AsyncStorage instead of GPS
    loadEventsByStoredLocation();
  }, []);

  const loadEventsByStoredLocation = async () => {
    try {
      const storedCity = await AsyncStorage.getItem('user_city');
      const storedLat = await AsyncStorage.getItem('user_lat');
      const storedLng = await AsyncStorage.getItem('user_lng');

      const lat = storedLat ? parseFloat(storedLat) : undefined;
      const lng = storedLng ? parseFloat(storedLng) : undefined;

      if (lat && lng) {
        setUserLocation({ latitude: lat, longitude: lng });
        await loadNearbyEvents(lat, lng);
      } else if (storedCity) {
        await loadNearbyEvents(undefined, undefined, storedCity);
      } else {
        await loadNearbyEvents();
      }
    } catch {
      await loadNearbyEvents();
    }
  };

  const requestLocationAndLoadEvents = async () => {
    try {
      const granted = await requestLocationPermission();
      setLocationGranted(granted);
      if (!granted) { setLoading(false); return; }
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          await loadNearbyEvents(latitude, longitude);
        },
        async () => { await loadNearbyEvents(); setLoading(false); },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
    } catch {
      await loadNearbyEvents();
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const loadNearbyEvents = async (latitude?: number, longitude?: number, city?: string) => {
    try {
      let query = '';
      if (latitude && longitude) {
        query = `?lat=${latitude}&lng=${longitude}&radiusKm=50`;
      } else if (city) {
        query = `?city=${encodeURIComponent(city)}`;
      }
      const response = await axios.get(`${API_BASE_URL}/events/nearby${query}`);
      setEvents(response.data.events || []);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        navigation.navigate('Loginscreen');
        return;
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const initialRegion: Region | undefined = userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.08, longitudeDelta: 0.08 }
    : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.rightControls}>
          <TouchableOpacity
            style={[styles.mapToggle, disableNativeMap && styles.mapToggleOff]}
            onPress={() => setDisableNativeMap(v => !v)}
          >
            <Text style={[styles.mapToggleText, disableNativeMap && styles.mapToggleTextOff]}>
              {disableNativeMap ? 'Map Off' : 'Map On'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.notifBtn}
          >
            <Icon name="notifications" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.title}>Map</Text>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Icon name="search" size={18} color="#ffffffde" />
                <TextInput
                  placeholder="Search events, venues..."
                  placeholderTextColor="#ffffffde"
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Icon name="close-circle" size={18} color="#ffffffde" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Map card */}
            <View style={[styles.mapCard, { height: MAP_HEIGHT }]}>
              {loading && !userLocation ? (
                <View style={styles.mapLoading}>
                  <ActivityIndicator size="large" color="#008E6D" />
                  <Text style={styles.loadingText}>Getting your location...</Text>
                </View>
              ) : disableNativeMap ? (
                <View style={styles.mapFallback}>
                  <Text style={styles.fallbackTitle}>Native map disabled</Text>
                  <Text style={styles.fallbackText}>
                    {GOOGLE_MAPS_API_KEY
                      ? "You've turned off the native map. Open the location in Google Maps instead."
                      : 'Google Maps key is missing, so the native map is disabled.'}
                  </Text>
                  <TouchableOpacity style={styles.openExternalBtn} onPress={openExternalMap}>
                    <Text style={styles.openExternalText}>Open in Google Maps</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <MapErrorBoundary>
                  <MapView
                    style={StyleSheet.absoluteFill}
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                    initialRegion={initialRegion ?? FALLBACK_REGION}
                    showsUserLocation
                  >
                    {userLocation && (
                      <Marker coordinate={userLocation} title="Your location" pinColor="#2563EB" />
                    )}
                    {filteredEvents.map(event =>
                      event.latitude != null && event.longitude != null ? (
                        <Marker
                          key={event._id}
                          coordinate={{ latitude: event.latitude, longitude: event.longitude }}
                          title={event.title}
                          description={event.venue}
                          onPress={() => navigation.navigate('Innerevetscreen', { eventId: event._id })}
                        />
                      ) : null
                    )}
                  </MapView>
                </MapErrorBoundary>
              )}
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {filteredEvents.length} nearby event{filteredEvents.length === 1 ? '' : 's'}
              </Text>
              <Text style={styles.summarySub}>
                {locationGranted ? 'Using your live location' : 'Showing all events with coordinates'}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#008E6D" style={{ marginTop: 24 }} />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="location-outline" size={44} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No nearby events found</Text>
              <Text style={styles.emptySub}>Try a different search or expand your radius.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })}
            activeOpacity={0.75}
          >
            <View style={styles.eventBadge}>
              <Icon name={item.isFree ? 'ticket-outline' : 'cash-outline'} size={18} color="#008E6D" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.eventMeta} numberOfLines={1}>{item.venue}{item.city ? ` · ${item.city}` : ''}</Text>
              <Text style={styles.eventMeta2} numberOfLines={1}>
                {item.isFree ? 'Free entry' : `£${item.price || '0'}`} · {item.date || 'Date TBA'}{item.time ? ` · ${item.time}` : ''}
              </Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default MapsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  rightControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mapToggle: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#e6fffa' },
  mapToggleOff: { backgroundColor: '#fee2e2' },
  mapToggleText: { color: '#047857', fontWeight: '700', fontSize: 13 },
  mapToggleTextOff: { color: '#b91c1c' },
  backText: { fontSize: 16, fontWeight: '700', color: '#111' },
  notifBtn: { backgroundColor: '#008E6D', borderRadius: 50, padding: 8 },
  listContent: { paddingBottom: 30, paddingHorizontal: 15 },
  listHeader: { paddingBottom: 14 },
  title: { fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 14 },
  searchContainer: { marginVertical: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#012D2E',
    borderRadius: 50,
    height: 45,
    paddingHorizontal: 14,
    gap: 8,
  },
  input: { flex: 1, color: '#fff', fontSize: 16 },
  mapCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 12,
    backgroundColor: '#f1f5f9',
  },
  mapLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: '#008E6D', fontWeight: '700' },
  mapFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#F8FAFC' },
  fallbackTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  fallbackText: { fontSize: 12.5, color: '#64748b', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  openExternalBtn: { marginTop: 12, backgroundColor: '#008E6D', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  openExternalText: { color: '#fff', fontWeight: '700' },
  summaryRow: { marginBottom: 8 },
  summaryText: { fontSize: 16, fontWeight: '700', color: '#012D2E' },
  summarySub: { marginTop: 4, fontSize: 12, color: '#94a3b8' },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef2f4',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  eventBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  eventInfo: { flex: 1, minWidth: 0 },
  eventTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  eventMeta: { fontSize: 12, color: '#64748b', marginTop: 3 },
  eventMeta2: { fontSize: 11.5, color: '#94a3b8', marginTop: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 34 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 8 },
  emptySub: { fontSize: 12.5, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
});