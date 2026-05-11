import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../components/Icon';
import { fetchEventById, Event } from '../services/eventService';
import { saveEvent, unsaveEvent, isEventSaved } from '../store/savedEventsStore';

const { width } = Dimensions.get('window');

// Gallery images scale with screen width: 3 visible at a time on any screen
const GALLERY_IMG_WIDTH = width * 0.32;
const GALLERY_IMG_HEIGHT = GALLERY_IMG_WIDTH * 0.8;

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
      } catch {
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008E6D" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#666' }}>Event not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenWrapper imageSource={require('../assets/eventbg.png')} backgroundColor="#FFFFFF">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {/* Header controls */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.iconBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="chevron-back" size={20} color="#000" />
              </TouchableOpacity>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Icon name="share-social-outline" size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={toggleSave}>
                  <Icon
                    name={saved ? 'heart' : 'heart-outline'}
                    size={18}
                    color={saved ? '#e53e3e' : '#000'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Price tag */}
            <View style={[styles.tag, { backgroundColor: event.isFree ? '#1DB954' : '#008E6D' }]}>
              <Text style={styles.tagText}>{event.isFree ? 'Free Entry' : `£${event.price}`}</Text>
            </View>

            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>{event.venue}</Text>

            {/* Info rows */}
            <View style={styles.infoBlock}>
              {event.date ? <Text style={styles.info}>📅  {event.date}</Text> : null}
              {event.time ? <Text style={styles.info}>🕐  {event.time}</Text> : null}
              {(event.address || event.city) ? (
                <Text style={styles.info}>📍  {[event.address, event.city].filter(Boolean).join(', ')}</Text>
              ) : null}
            </View>

            {/* About */}
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{event.description}</Text>

            {/* Gallery */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Venue Gallery</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                  {event.galleryImages.map((img, index) => (
                    <Image
                      key={index}
                      source={{ uri: img }}
                      style={[styles.galleryImg, { width: GALLERY_IMG_WIDTH, height: GALLERY_IMG_HEIGHT }]}
                    />
                  ))}
                </ScrollView>
              </>
            )}

            {/* Opening hours */}
            {event.openingHours && event.openingHours.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Opening Hours</Text>
                {event.openingHours.map((item, i) => (
                  <View key={i} style={styles.hoursRow}>
                    <Text style={styles.day}>{item.day}</Text>
                    <Text style={styles.hoursTime}>{item.hours}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Static map placeholder */}
            <Image
              source={require('../assets/map.png')}
              style={styles.map}
              resizeMode="cover"
            />

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
  root: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  // paddingBottom in points, not percentage — consistent across all devices
  content: { paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center', alignItems: 'center',
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, marginBottom: 12,
  },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  eventTitle: { fontSize: 22, fontWeight: '700', color: '#012D2E', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 10 },
  infoBlock: { marginBottom: 4, gap: 4 },
  info: { fontSize: 13, color: '#555', lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#000', marginTop: 20, marginBottom: 10 },
  description: { fontSize: 13, color: '#666', lineHeight: 20 },
  galleryScroll: { marginBottom: 4 },
  galleryImg: { borderRadius: 10, marginRight: 10 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  day: { fontSize: 13, color: '#555' },
  hoursTime: { fontSize: 13, color: '#555' },
  // Map image scales to full content width
  map: { width: '100%', height: Math.max(130, width * 0.35), borderRadius: 14, marginTop: 16 },
  button: {
    marginVertical: 16,
    backgroundColor: '#7AC943',
    paddingVertical: 13,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});