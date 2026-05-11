import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '../components/Icon';
import CategoryCard from '../components/CategoryCard';
import EventList from '../components/EventList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchEvents, Event } from '../services/eventService';

const { width } = Dimensions.get('window');

// 3 columns with even spacing
const COLUMN_COUNT = 3;
const HORIZONTAL_PADDING = 30; // 15 * 2
const COLUMN_GAP = 10;
const CARD_WIDTH = (width - HORIZONTAL_PADDING - COLUMN_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

const catedata = [
  { icon: 'musical-notes-outline', label: 'Live Music' },
  { icon: 'headset-outline', label: 'DJ Nightlife' },
  { icon: 'sparkles-outline', label: 'Events' },
  { icon: 'restaurant-outline', label: 'Food & Drink' },
  { icon: 'people-outline', label: 'Clubs' },
  { icon: 'happy-outline', label: 'Comedy' },
];

const BrowseScreen = ({ navigation }: { navigation: any }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents({ limit: 100 });
        setEvents(data);
      } catch (error) {
        console.error('Browse load error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryCounts = useMemo(() => {
    return catedata.reduce<Record<string, number>>((acc, item) => {
      acc[item.label] = events.filter(event => event.category === item.label).length;
      return acc;
    }, {});
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return events;
    return events.filter(event => event.category === selectedCategory);
  }, [events, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifBtn}
        >
          <Icon name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Browse</Text>
          <Text style={styles.subtitle}>Explore by category</Text>

          {/* Category Grid */}
          <View style={styles.categoryGrid}>
            {catedata.map((item, index) => (
              <View key={index} style={styles.categoryCell}>
                <CategoryCard
                  {...item}
                  count={categoryCounts[item.label] || 0}
                  onPress={() => {
                    setSelectedCategory(item.label);
                    navigation.navigate('Categorydetails', { categoryName: item.label });
                  }}
                />
              </View>
            ))}
          </View>

          {/* Events header */}
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>
              {selectedCategory === 'All' ? 'All Events' : selectedCategory}
            </Text>
            {loading && <ActivityIndicator size="small" color="#008E6D" />}
          </View>

          <FlatList
            data={filteredEvents}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <EventList
                item={item}
                onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })}
              />
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
            ListEmptyComponent={
              !loading ? <Text style={styles.emptyText}>No events found</Text> : null
            }
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrowseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backText: { fontSize: 16, fontWeight: '700', color: '#111' },
  notifBtn: { backgroundColor: '#008E6D', borderRadius: 50, padding: 8 },
  content: { paddingHorizontal: 15, paddingBottom: 120 },
  pageTitle: { fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 16 },
  subtitle: { fontSize: 12, color: '#555', marginBottom: 4 },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    marginBottom: 8,
    // Negative margin trick to handle column gaps cleanly
    marginHorizontal: -COLUMN_GAP / 2,
  },
  categoryCell: {
    width: CARD_WIDTH,
    marginHorizontal: COLUMN_GAP / 2,
    marginBottom: 18,
    alignItems: 'center',
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventsTitle: { fontSize: 16, fontWeight: '700', color: '#012D2E' },
  emptyText: { color: '#999', marginTop: 12 },
});