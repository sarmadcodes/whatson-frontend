import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getToken } from '../store/authStore';
import { createEvent, fetchMyEvents, Event } from '../services/eventService';

const CATEGORIES = ['Live Music', 'DJ Nightlife', 'Events', 'Food & Drink', 'Clubs', 'Comedy'];

const emptyForm = {
  title: '',
  description: '',
  venue: '',
  address: '',
  city: '',
  category: 'Live Music',
  date: '',
  time: '',
  price: '',
  isFree: false,
  imageUrl: '',
  latitude: '',
  longitude: '',
};

const ManageEvents = ({ navigation }: { navigation: any }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchMyEvents();
      setEvents(data);
    } catch (err) {
      setError('Could not load your events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (name: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (uri: string) => {
    const token = await getToken();
    const body = new FormData();
    const filename = uri.split('/').pop() || `event-${Date.now()}.jpg`;
    const type = filename.match(/\.(\w+)$/)?.[1] ? `image/${filename.split('.').pop()}` : 'image/jpeg';
    body.append('file', { uri, name: filename, type } as any);

    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body,
    });
    const data = await response.json();
    if (!response.ok || !data?.url) {
      throw new Error(data?.message || 'Upload failed');
    }
    return data.url as string;
  };

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, async response => {
      if (response.didCancel || !response.assets?.length) return;
      try {
        setSubmitting(true);
        const uri = response.assets[0].uri;
        if (!uri) return;
        const url = await uploadImage(uri);
        setForm(prev => ({ ...prev, imageUrl: url }));
      } catch (err) {
        setError('Image upload failed.');
      } finally {
        setSubmitting(false);
      }
    });
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.title || !form.description || !form.venue || !form.address || !form.city || !form.date || !form.time || !form.imageUrl) {
      setError('Please fill all required fields and upload an image.');
      return;
    }

    try {
      setSubmitting(true);
      await createEvent({
        ...form,
        price: form.isFree ? '' : form.price,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        galleryImages: [],
        openingHours: [],
      } as Partial<Event>);
      setForm(emptyForm);
      await loadEvents();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={events}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ paddingBottom: 20 }}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Manage Your Events</Text>
              <View style={{ width: 40 }} />
            </View>

            <Text style={styles.subTitle}>Submit an event and we’ll send it for admin approval.</Text>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>New Event</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Text style={styles.label}>Event Title *</Text>
              <TextInput style={styles.input} value={form.title} onChangeText={t => handleChange('title', t)} placeholder="Jazz Night at The Blue Room" />

              <Text style={styles.label}>Description *</Text>
              <TextInput style={[styles.input, styles.textArea]} multiline value={form.description} onChangeText={t => handleChange('description', t)} placeholder="Tell people what makes this event special" />

              <Text style={styles.label}>Venue *</Text>
              <TextInput style={styles.input} value={form.venue} onChangeText={t => handleChange('venue', t)} placeholder="Venue name" />

              <Text style={styles.label}>Address *</Text>
              <TextInput style={styles.input} value={form.address} onChangeText={t => handleChange('address', t)} placeholder="Street address" />

              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput style={styles.input} value={form.city} onChangeText={t => handleChange('city', t)} placeholder="City" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Category *</Text>
                  <View style={styles.pickerWrap}>
                    <TextInput
                      style={styles.input}
                      value={form.category}
                      onChangeText={t => handleChange('category', t)}
                      placeholder="Category"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Date *</Text>
                  <TextInput style={styles.input} value={form.date} onChangeText={t => handleChange('date', t)} placeholder="Fri, 16th May, 2026" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Time *</Text>
                  <TextInput style={styles.input} value={form.time} onChangeText={t => handleChange('time', t)} placeholder="9:00 PM" />
                </View>
              </View>

              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Price</Text>
                  <TextInput style={styles.input} value={form.price} onChangeText={t => handleChange('price', t)} placeholder="15" editable={!form.isFree} />
                </View>
                <TouchableOpacity style={[styles.freeChip, form.isFree && styles.freeChipActive]} onPress={() => handleChange('isFree', !form.isFree)}>
                  <Text style={[styles.freeChipText, form.isFree && styles.freeChipTextActive]}>{form.isFree ? 'Free entry on' : 'Free entry off'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Main Image *</Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                {form.imageUrl ? (
                  <Image source={{ uri: form.imageUrl }} style={styles.previewImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#008E6D" />
                    <Text style={styles.uploadText}>Select from gallery and upload to Cloudinary</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Latitude</Text>
                  <TextInput style={styles.input} value={form.latitude} onChangeText={t => handleChange('latitude', t)} placeholder="54.5973" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Longitude</Text>
                  <TextInput style={styles.input} value={form.longitude} onChangeText={t => handleChange('longitude', t)} placeholder="-5.9301" />
                </View>
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit for Approval</Text>}
              </TouchableOpacity>
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Your Submitted Events</Text>
              <Text style={styles.muted}>{events.length} total</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#008E6D" style={{ marginTop: 30 }} />
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={44} color="#ccc" />
              <Text style={styles.emptyText}>No submitted events yet.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.eventMeta}>{item.venue} • {item.city}</Text>
              <Text style={[styles.statusBadge, item.status === 'approved' ? styles.approved : item.status === 'pending' ? styles.pending : styles.rejected]}>
                {item.status || 'approved'}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ManageEvents;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  backText: { fontSize: 16, fontWeight: '700', color: '#111' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#012D2E' },
  subTitle: { color: '#666', marginBottom: 12 },
  formCard: { backgroundColor: '#f8fafb', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e8ecf0' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#012D2E', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '700', color: '#4b5563', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dde3e8', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: '#111' },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: 10 },
  pickerWrap: { flex: 1 },
  freeChip: { alignSelf: 'flex-end', marginTop: 24, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, backgroundColor: '#eef2f4' },
  freeChipActive: { backgroundColor: '#008E6D' },
  freeChipText: { color: '#334155', fontWeight: '700', fontSize: 12 },
  freeChipTextActive: { color: '#fff' },
  uploadBtn: { marginTop: 4, borderWidth: 1, borderColor: '#dde3e8', borderStyle: 'dashed', borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff' },
  uploadPlaceholder: { minHeight: 160, alignItems: 'center', justifyContent: 'center', gap: 8 },
  uploadText: { fontSize: 13, fontWeight: '700', color: '#008E6D', textAlign: 'center', paddingHorizontal: 10 },
  previewImage: { width: '100%', height: 180, resizeMode: 'cover' },
  submitBtn: { marginTop: 14, backgroundColor: '#008E6D', borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  errorText: { color: '#c62828', fontWeight: '700', marginBottom: 8 },
  listHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 18, marginBottom: 10 },
  muted: { color: '#94a3b8', fontSize: 12 },
  eventCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eef2f4', borderRadius: 16, padding: 12, marginBottom: 12 },
  eventImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#f1f5f9' },
  eventTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  eventMeta: { fontSize: 12, color: '#64748b', marginTop: 3 },
  statusBadge: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, overflow: 'hidden', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  approved: { backgroundColor: 'rgba(16,185,129,0.12)', color: '#047857' },
  pending: { backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309' },
  rejected: { backgroundColor: 'rgba(239,68,68,0.12)', color: '#b91c1c' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { color: '#94a3b8', fontWeight: '700', marginTop: 8 },
});
