import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';
import { fetchEvents, Event } from '../services/eventService';

const { width } = Dimensions.get('window');

// Two columns with consistent gutters on all screen sizes
const HORIZONTAL_PADDING = 30; // 15 * 2
const COLUMN_GAP = 12;
const CARD_WIDTH = (width - HORIZONTAL_PADDING - COLUMN_GAP) / 2;

const CategoryDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { categoryName } = route.params;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents({ category: categoryName, limit: 100 });
        setEvents(data);
      } catch (error) {
        console.error('Category detail load error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryName]);

  return (
    <View style={styles.container}>
      <ScreenWrapper imageSource={require('../assets/homebg.png')} backgroundColor="#FFFFFF">
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{categoryName}</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{categoryName} Near You</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#008E6D" style={{ marginTop: 50 }} />
          ) : events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={item => item._id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <EventCard
                    data={item}
                    onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })}
                  />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              {/* Responsive icon: clamp to 15% of screen width */}
              <Icon name="calendar-outline" size={Math.min(80, width * 0.18)} color="#ccc" />
              <Text style={styles.emptyText}>No events found for {categoryName}</Text>
            </View>
          )}
        </View>
      </ScreenWrapper>
    </View>
  );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  content: { marginTop: 20, flex: 1 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#012D2E',
    marginBottom: 14,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: COLUMN_GAP,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  listContent: { paddingBottom: 100 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});