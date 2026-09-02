import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import FilterGroup from '../components/FilterGroup';
import EventCard from '../components/EventCard';
import { FilterIcon, HeartIcon, SearchIcon, BellIcon, PinIcon, StarIcon, CloseIcon } from '../components/SvgIcons';
import EventList from '../components/EventList';
import CategoryCard from '../components/CategoryCard';
import { fetchEvents, fetchNearbyEvents, Event } from '../services/eventService';

const { width } = Dimensions.get('window');

const myFilters = [
  { id: 'All', name: 'All' },
  { id: 'Today', name: 'Today' },
  { id: 'Tonight', name: 'Tonight' },
  { id: 'This Week', name: 'This Week' },
];

const categoryCards = [
  { icon: 'musical-notes-outline', label: 'Live Music' },
  { icon: 'headset-outline', label: 'DJ Nightlife' },
  { icon: 'sparkles-outline', label: 'Events' },
  { icon: 'restaurant-outline', label: 'Food & Drink' },
  { icon: 'people-outline', label: 'Clubs' },
  { icon: 'happy-outline', label: 'Comedy' },
];

const normalizeDateText = (value?: string) => (value || '').replace(/(\d+)(st|nd|rd|th)/gi, '$1');

const parseEventDate = (event: Event) => {
  const parsed = Date.parse(normalizeDateText(event.date));
  return Number.isNaN(parsed) ? null : new Date(parsed);
};

const getTimeHour = (time?: string) => {
  if (!time) return null;
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const suffix = match[3]?.toLowerCase();
  if (suffix === 'pm' && hour !== 12) hour += 12;
  if (suffix === 'am' && hour === 12) hour = 0;
  return hour;
};

const isTodayEvent = (event: Event) => {
  const raw = `${event.date} ${event.time}`.toLowerCase();
  if (raw.includes('today')) return true;
  const parsed = parseEventDate(event);
  if (!parsed) return false;
  const now = new Date();
  return parsed.toDateString() === now.toDateString();
};

const isTonightEvent = (event: Event) => {
  const raw = `${event.date} ${event.time}`.toLowerCase();
  if (raw.includes('tonight')) return true;
  if (!isTodayEvent(event)) return false;
  const hour = getTimeHour(event.time);
  return hour !== null ? hour >= 18 : true;
};

const isThisWeekEvent = (event: Event) => {
  const raw = `${event.date} ${event.time}`.toLowerCase();
  if (raw.includes('this week')) return true;
  const parsed = parseEventDate(event);
  if (!parsed) return false;
  const now = new Date();
  const diffDays = (parsed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
};

// Responsive card height based on screen width
const CARD_HEIGHT = width < 360 ? 130 : 150;

const DiscoverScreen = ({ navigation }: { navigation: any }) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Today' | 'Tonight' | 'This Week'>('All');
  const [userCity, setUserCity] = useState('London, United Kingdom');

  const loadEvents = useCallback(async () => {
    try {
      const storedCity = await AsyncStorage.getItem('user_city');
      const storedLat = await AsyncStorage.getItem('user_lat');
      const storedLng = await AsyncStorage.getItem('user_lng');

      const lat = storedLat ? parseFloat(storedLat) : undefined;
      const lng = storedLng ? parseFloat(storedLng) : undefined;
      const city = lat === undefined && lng === undefined && storedCity ? storedCity : undefined;

      if (storedCity) setUserCity(storedCity);

      const [featured, nearby, recent, all] = await Promise.all([
        fetchEvents({ isFeatured: true, limit: 10 }),
        fetchNearbyEvents(lat, lng, 50, city),
        fetchEvents({ limit: 8 }),
        fetchEvents({ limit: 100 }),
      ]);
      setFeaturedEvents(featured);
      setNearbyEvents(nearby);
      setRecentEvents(recent);
      setAllEvents(all);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  useFocusEffect(useCallback(() => { loadEvents(); }, [loadEvents]));

  const onRefresh = () => { setRefreshing(true); loadEvents(); };

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (query.length > 0) navigation.navigate('Search', { query });
  };

  const tabFilteredEvents = useMemo(() => {
    switch (selectedFilter) {
      case 'Today': return allEvents.filter(isTodayEvent);
      case 'Tonight': return allEvents.filter(isTonightEvent);
      case 'This Week': return allEvents.filter(isThisWeekEvent);
      default: return allEvents;
    }
  }, [allEvents, selectedFilter]);

  const visibleFeatured = useMemo(
    () => featuredEvents.filter(e => tabFilteredEvents.some(i => i._id === e._id)),
    [featuredEvents, tabFilteredEvents],
  );
  const visibleNearby = useMemo(
    () => nearbyEvents.filter(e => tabFilteredEvents.some(i => i._id === e._id)),
    [nearbyEvents, tabFilteredEvents],
  );
  const visibleRecent = useMemo(
    () => recentEvents.filter(e => tabFilteredEvents.some(i => i._id === e._id)),
    [recentEvents, tabFilteredEvents],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008E6D" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenWrapper imageSource={require('../assets/homebg.png')} backgroundColor="#FFFFFF">
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#008E6D']} />}
        >
          {/* Extra bottom padding so content clears the tab bar on all screen sizes */}
          <View style={styles.content}>
            {/* Header row */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Locationscreen')}
                style={styles.locationBtn}
              >
                <PinIcon size={20} color="#FF0000" />
                <View style={styles.locationTextWrap}>
                  <Text style={styles.locationLabel}>Location</Text>
                  <Text style={styles.locationCity} numberOfLines={1}>{userCity}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={styles.bellBtn}
              >
                <BellIcon size={20} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.pageTitle}>Discover</Text>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <SearchIcon size={20} color="#ffffffde" />
                <TextInput
                  placeholder="Search events, venues..."
                  placeholderTextColor="#ffffffde"
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <CloseIcon size={20} color="#ffffffde" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <FilterGroup items={myFilters} selectedId={selectedFilter} onSelect={(v: any) => setSelectedFilter(v as any)} />

            {/* Categories */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categoryCards.map((item, index) => (
                <View key={index} style={styles.categoryItem}>
                  <CategoryCard
                    {...item}
                    onPress={() => navigation.navigate('Categorydetails', { categoryName: item.label })}
                  />
                </View>
              ))}
            </ScrollView>

            {/* Featured */}
            <View style={styles.sectionRow}>
              <View style={styles.sectionLeft}>
                <Text style={styles.sectionTitle}>Featured</Text>
                <StarIcon size={15} color="#FFB800" />
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Featured', type: 'card', filter: 'featured' })}>
                <Text style={styles.seeMore}>See more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: CARD_HEIGHT }}>
              {visibleFeatured.length === 0 ? (
                <Text style={styles.emptyText}>No featured events yet</Text>
              ) : (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={visibleFeatured}
                  renderItem={({ item }) => (
                    <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
                  )}
                  keyExtractor={item => item._id}
                  contentContainerStyle={styles.hListContent}
                />
              )}
            </View>

            {/* Nearby */}
            <View style={styles.sectionRow}>
              <View style={styles.sectionLeft}>
                <Text style={styles.sectionTitle}>Nearby Events</Text>
                <StarIcon size={15} color="#FFB800" />
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Nearby Events', type: 'card', filter: 'all' })}>
                <Text style={styles.seeMore}>See more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: CARD_HEIGHT }}>
              {visibleNearby.length === 0 ? (
                <Text style={styles.emptyText}>No events nearby</Text>
              ) : (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={visibleNearby}
                  renderItem={({ item }) => (
                    <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
                  )}
                  keyExtractor={item => item._id}
                  contentContainerStyle={styles.hListContent}
                />
              )}
            </View>

            {/* Happening Now */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Happening Now</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Happening Now', type: 'list', filter: 'all' })}>
                <Text style={styles.seeMore}>See more</Text>
              </TouchableOpacity>
            </View>
            {visibleRecent.length === 0 ? (
              <Text style={styles.emptyText}>No events right now</Text>
            ) : (
              <FlatList
                data={visibleRecent}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <EventList item={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
                )}
                contentContainerStyle={{ paddingVertical: 10 }}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  // Use paddingBottom in points so it is the same across all screen sizes
  content: { paddingBottom: 120 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  locationBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, marginRight: 12 },
  locationTextWrap: { flex: 1 },
  locationLabel: { fontSize: 16, fontWeight: '700', color: '#fff' },
  locationCity: { fontSize: 12, fontWeight: '400', color: '#ffffffde' },
  bellBtn: { backgroundColor: '#74C33C', borderRadius: 50, padding: 8 },
  pageTitle: { fontSize: 25, fontWeight: '700', color: '#012D2E', marginTop: 20 },
  searchContainer: { marginVertical: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#74C33C',
    borderRadius: 50,
    height: 45,
    paddingHorizontal: 14,
  },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 8 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 10,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#012D2E' },
  seeMore: { fontSize: 12, color: '#111' },
  categoryScroll: { paddingLeft: 2, paddingRight: 4, paddingBottom: 6 },
  categoryItem: { marginRight: 12 },
  hListContent: { paddingVertical: 5, paddingRight: 4 },
  emptyText: { color: '#999', fontSize: 13, paddingVertical: 10 },
});