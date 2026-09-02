import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../components/Icon';
import EventList from '../components/EventList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSavedEvents } from '../store/savedEventsStore';
import { Event, fetchEventById } from '../services/eventService';

const SavedEventsScreen = ({ navigation }: { navigation: any }) => {
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        const saved = await AsyncStorage.getItem('saved_events');
        const savedIds: string[] = saved ? JSON.parse(saved) : [];
        if (savedIds.length === 0) { 
          setSavedEvents([]); 
          setLoading(false);
          return; 
        }
        // Fetch each event by ID
        const results = await Promise.all(
          savedIds.map(id => fetchEventById(id).catch(() => null))
        );
        setSavedEvents(results.filter(Boolean) as Event[]);
        setLoading(false);
      };
      load();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifCircle}>
          <Icon name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Saved Events</Text>
        <Text style={styles.screenSubtitle}>Your favourite events in one place</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#008E6D" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={savedEvents}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <EventList item={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Icon name="heart-outline" size={80} color="#ddd" />
                <Text style={styles.emptyText}>No saved events yet</Text>
                <Text style={{ color: '#aaa', fontSize: 13, marginTop: 5 }}>Tap the heart icon on any event to save it</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backButtonText: { fontSize: 16, fontWeight: '700', color: '#111' },
  notifCircle: { backgroundColor: '#008E6D', borderRadius: 50, padding: 8 },
  content: { flex: 1, paddingHorizontal: 15 },
  screenTitle: { fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 20 },
  screenSubtitle: { fontSize: 12, color: '#555', marginBottom: 10 },
  listContainer: { paddingVertical: 15, paddingBottom: 50 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', marginTop: 10, fontSize: 16 },
});

export default SavedEventsScreen;