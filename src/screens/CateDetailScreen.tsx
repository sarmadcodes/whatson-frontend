import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import EventCard from '../components/EventCard';
import Ionicons from '@react-native-vector-icons/ionicons';
import { fetchEvents, Event } from '../services/eventService';

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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{categoryName} Near You</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#008E6D" style={{ marginTop: 50 }} />
          ) : events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={80} color="#ccc" />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    marginTop: 30,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#012D2E',
    marginBottom: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
