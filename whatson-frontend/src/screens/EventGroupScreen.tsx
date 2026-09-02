import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon, HeartIcon } from '../components/SvgIcons';
import Icon from '../components/Icon';
import EventCard from '../components/EventCard';
import EventList from '../components/EventList';
import { fetchEvents, Event } from '../services/eventService';

const EventGroupScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { title, type, filter } = route.params;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const params = filter === 'featured' ? { isFeatured: true } : {};
        const data = await fetchEvents(params);
        setEvents(data);
      } catch (error) {
        console.error('EventGroup load error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#008E6D" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsIcon}>
          <Icon name="options-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#008E6D" style={{ marginTop: 50 }} />
        ) : events.length === 0 ? (
          <Text style={{ color: '#999', marginTop: 30, textAlign: 'center' }}>No events found</Text>
        ) : type === 'card' ? (
          <FlatList
            data={events}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={events}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <EventList item={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventGroupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, fontWeight: '700', color: '#111', marginLeft: 5 },
  settingsIcon: { backgroundColor: '#008E6D', borderRadius: 50, padding: 8 },
  content: { flex: 1, paddingHorizontal: 15 },
  title: { fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 10, marginBottom: 15 },
  listContent: { paddingBottom: 30 },
  columnWrapper: { justifyContent: 'space-between' },
  cardWrapper: { width: '48%', marginBottom: 15, height: 160 },
});