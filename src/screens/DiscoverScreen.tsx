import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator, RefreshControl,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import FilterGroup from '../components/FilterGroup';
import EventCard from '../components/EventCard';
import Ionicons from '@react-native-vector-icons/ionicons';
import EventList from '../components/EventList';
import CategoryCard from '../components/CategoryCard';
import { fetchEvents, Event } from '../services/eventService';

const DiscoverScreen = ({ navigation }: { navigation: any }) => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [happeningNow, setHappeningNow] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const catedata = [
    { icon: 'musical-notes-outline', label: 'Live Music' },
    { icon: 'headset-outline', label: 'DJ Nightlife' },
    { icon: 'sparkles-outline', label: 'Events' },
    { icon: 'restaurant-outline', label: 'Food & Drink' },
    { icon: 'people-outline', label: 'Clubs' },
    { icon: 'happy-outline', label: 'Comedy' },
  ];

  const myFilters = [
    { id: 1, name: 'All' },
    { id: 2, name: 'Today' },
    { id: 3, name: 'Tonight' },
    { id: 5, name: 'This Week' },
  ];

  const loadEvents = useCallback(async () => {
    try {
      const [featured, nearby, now] = await Promise.all([
        fetchEvents({ isFeatured: true, limit: 10 }),
        fetchEvents({ limit: 10 }),
        fetchEvents({ limit: 5 }),
      ]);
      setFeaturedEvents(featured);
      setNearbyEvents(nearby);
      setHappeningNow(now);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('Search', { query: searchQuery });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#008E6D" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenWrapper imageSource={require('../assets/homebg.png')} backgroundColor="#FFFFFF">
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#008E6D']} />}
        >
          <View style={{ paddingBottom: '40%' }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="pin-sharp" size={20} color="red" />
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Location</Text>
                  <Text style={{ fontSize: 12, fontWeight: '400', color: '#ffffffde' }}>London, United Kingdom</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')}
                style={{ backgroundColor: '#74C33C', borderRadius: 50, padding: 8 }}>
                <Ionicons name="notifications" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 25, fontWeight: '700', color: '#012D2E', marginTop: 20 }}>Discover</Text>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#ffffffde" style={{ marginLeft: 15 }} />
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
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#ffffffde" style={{ marginRight: 15 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <FilterGroup items={myFilters} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#012D2E' }}>Categories</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {catedata.map((item, index) => (
                <View key={index} style={{ marginRight: 12 }}>
                  <CategoryCard {...item} onPress={() => navigation.navigate('Categorydetails', { categoryName: item.label })} />
                </View>
              ))}
            </ScrollView>

            {/* Featured */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5, marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#012D2E' }}>Featured</Text>
                <Ionicons name="star" size={15} color="orange" />
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Featured', type: 'card', filter: 'featured' })}>
                <Text style={{ fontSize: 12, color: '#111' }}>See more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 150 }}>
              {featuredEvents.length === 0 ? (
                <Text style={{ color: '#999', fontSize: 13, paddingVertical: 10 }}>No featured events yet</Text>
              ) : (
                <FlatList
                  horizontal showsHorizontalScrollIndicator={false}
                  data={featuredEvents}
                  renderItem={({ item }) => (
                    <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
                  )}
                  keyExtractor={item => item._id}
                  contentContainerStyle={{ paddingVertical: 5 }}
                />
              )}
            </View>

            {/* Nearby */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5, marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#012D2E' }}>Nearby Events</Text>
                <Ionicons name="star" size={15} color="orange" />
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Nearby Events', type: 'card', filter: 'all' })}>
                <Text style={{ fontSize: 12, color: '#111' }}>See more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 150 }}>
              {nearbyEvents.length === 0 ? (
                <Text style={{ color: '#999', fontSize: 13, paddingVertical: 10 }}>No events nearby</Text>
              ) : (
                <FlatList
                  horizontal showsHorizontalScrollIndicator={false}
                  data={nearbyEvents}
                  renderItem={({ item }) => (
                    <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
                  )}
                  keyExtractor={item => item._id}
                  contentContainerStyle={{ paddingVertical: 5 }}
                />
              )}
            </View>

            {/* Happening Now */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5, marginTop: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#012D2E' }}>Happening Now</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Happening Now', type: 'list', filter: 'all' })}>
                <Text style={{ fontSize: 12, color: '#111' }}>See more</Text>
              </TouchableOpacity>
            </View>
            {happeningNow.length === 0 ? (
              <Text style={{ color: '#999', fontSize: 13, paddingVertical: 10 }}>No events right now</Text>
            ) : (
              <FlatList
                data={happeningNow}
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
  searchContainer: { marginVertical: 10, borderRadius: 50 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#74C33C', borderRadius: 50, height: 45 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 10 },
});
