import React, { useEffect, useState } from 'react';
import {
  Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert,
} from 'react-native';
import { StatusBar } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Ionicons from '@react-native-vector-icons/ionicons';
import { fetchEventById, Event } from '../services/eventService';
import { saveEvent, unsaveEvent, isEventSaved } from '../store/savedEventsStore';

const InnerEventScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { eventId } = route.params || {};
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!eventId) { setLoading(false); return; }
        const data = await fetchEventById(eventId);
        setEvent(data);
        const alreadySaved = await isEventSaved(eventId);
        setSaved(alreadySaved);
      } catch (error) {
        Alert.alert('Error', 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const toggleSave = async () => {
    if (!event) return;
    if (saved) {
      await unsaveEvent(event._id);
      setSaved(false);
    } else {
      await saveEvent(event);
      setSaved(true);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#008E6D" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: '#666' }}>Event not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenWrapper imageSource={require('../assets/eventbg.png')} backgroundColor="#FFFFFF">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: '40%' }}>

            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <Ionicons name="chevron-back" size={20} color="#000" />
              </TouchableOpacity>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="share-social-outline" size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={toggleSave}>
                  <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? 'red' : '#000'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.tag, { backgroundColor: event.isFree ? '#1DB954' : '#008E6D' }]}>
              <Text style={styles.tagText}>{event.isFree ? 'Free Entry' : `£${event.price}`}</Text>
            </View>

            <Text style={{ fontSize: 22, fontWeight: '700', color: '#012D2E', marginTop: 20 }}>{event.title}</Text>
            <Text style={styles.subtitle}>{event.venue}</Text>

            <Text style={styles.info}>{event.date}</Text>
            <Text style={styles.info}>{event.time}</Text>
            <Text style={styles.info}>{event.address}, {event.city}</Text>

            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{event.description}</Text>

            {event.galleryImages && event.galleryImages.length > 0 && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#012D2E' }}>Venue Gallery</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {event.galleryImages.map((img, index) => (
                    <Image key={index} source={{ uri: img }} style={styles.galleryImg} />
                  ))}
                </ScrollView>
              </>
            )}

            {event.openingHours && event.openingHours.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Opening Hours</Text>
                {event.openingHours.map((item, i) => (
                  <View key={i} style={styles.hoursRow}>
                    <Text style={styles.day}>{item.day}</Text>
                    <Text style={styles.time}>{item.hours}</Text>
                  </View>
                ))}
              </>
            )}

            <Image source={require('../assets/map.png')} style={styles.map} />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

export default InnerEventScreen;

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 35, height: 35, borderRadius: 50, backgroundColor: '#ffffffb0', justifyContent: 'center', alignItems: 'center' },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 10 },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 10 },
  info: { fontSize: 12, color: '#666' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 10, color: '#000' },
  description: { fontSize: 12, color: '#666', lineHeight: 18 },
  galleryImg: { width: 110, height: 90, borderRadius: 10, marginRight: 10 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  day: { fontSize: 12, color: '#666' },
  time: { fontSize: 12, color: '#666' },
  map: { width: '100%', height: 150, borderRadius: 12, marginTop: 15 },
  button: { marginVertical: 15, backgroundColor: '#7AC943', paddingVertical: 10, borderRadius: 50, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
