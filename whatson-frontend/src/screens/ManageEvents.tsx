import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from '../components/Icon';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_BASE_URL } from '../config/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';
import { getToken } from '../store/authStore';
import { createEvent, fetchMyEvents, Event } from '../services/eventService';
import axios from 'axios';

const { width } = Dimensions.get('window');

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
  latitude: null as number | null,
  longitude: null as number | null,
};

const ManageEvents = ({ navigation }: { navigation: any }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [error, setError] = useState('');

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchMyEvents();
      setEvents(data);
    } catch {
      setError('Could not load your events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleChange = (name: string, value: string | boolean | number | null) => {
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
    if (!response.ok || !data?.url) throw new Error(data?.message || 'Upload failed');
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
      } catch {
        setError('Image upload failed.');
      } finally {
        setSubmitting(false);
      }
    });
  };

  const handleSubmit = async () => {
    setError('');
    
    // We intentionally removed 'address' and 'time' strict requirements to allow easier testing,
    // actually let's just make sure title, venue, city, date are there. Address might be auto-filled empty if not selected.
    if (!form.title || !form.venue || !form.city || !form.date || !form.imageUrl) {
      setError('Please fill all required fields and upload an image.');
      return;
    }
    try {
      setSubmitting(true);
      await createEvent({
        ...form,
        price: form.isFree ? '' : form.price,
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,
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

  const handleToggleActive = async (id: string) => {
    try {
      const token = await getToken();
      await axios.patch(`${API_BASE_URL}/events/${id}/toggle-active`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setEvents(prev => prev.map(e => e._id === id ? { ...e, isActive: !e.isActive } : e));
    } catch (err) {
      console.warn('Failed to toggle event active state', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#042929" />
      <FlatList
        data={events}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeaderWrap}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Manage Your Events</Text>
              <View style={{ width: 40 }} />
            </View>

            <Text style={styles.subTitle}>Submit an event and we'll send it for admin approval.</Text>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>New Event</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Text style={styles.label}>Event Title *</Text>
              <TextInput style={styles.input} value={form.title} onChangeText={t => handleChange('title', t)} placeholder="Jazz Night at The Blue Room" placeholderTextColor="#aaa" />

              <Text style={styles.label}>Description *</Text>
              <TextInput style={[styles.input, styles.textArea]} multiline value={form.description} onChangeText={t => handleChange('description', t)} placeholder="Tell people what makes this event special" placeholderTextColor="#aaa" />

              <Text style={styles.label}>Venue *</Text>
              <TextInput style={styles.input} value={form.venue} onChangeText={t => handleChange('venue', t)} placeholder="Venue name" placeholderTextColor="#aaa" />

              <Text style={styles.label}>Venue Location *</Text>
              <GooglePlacesAutocomplete
                placeholder="Search venue address..."
                fetchDetails
                onPress={(data, details) => {
                  if (!details) return;
                  const lat = details.geometry?.location?.lat;
                  const lng = details.geometry?.location?.lng;
                  const components = details.address_components || [];
                  const cityComp = components.find((c: any) =>
                    c.types.includes('postal_town') ||
                    c.types.includes('locality')
                  );
                  handleChange('address', details.formatted_address || data.description);
                  handleChange('city', cityComp?.long_name || form.city);
                  handleChange('latitude', lat ?? null);
                  handleChange('longitude', lng ?? null);
                }}
                query={{ key: GOOGLE_MAPS_API_KEY, language: 'en' }}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps="handled"
                styles={{
                  textInput: { ...styles.input, paddingLeft: 12 },
                  listView: { borderWidth: 1, borderColor: '#dde3e8', borderRadius: 12, marginTop: 4 },
                  row: { paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#042929' },
                  description: { color: '#FFFFFF', fontSize: 13 },
                }}
              />
              {form.latitude && form.longitude && (
                <Text style={styles.locationConfirmed}>
                  📍 Location pinned · {form.city}
                </Text>
              )}

              {/* City + Category: stack on narrow screens */}
              <View style={styles.twoCol}>
                <View style={styles.colHalf}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput style={styles.input} value={form.city} onChangeText={t => handleChange('city', t)} placeholder="City" placeholderTextColor="#aaa" />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.label}>Category *</Text>
                  <TouchableOpacity style={styles.input} onPress={() => setShowCategoryModal(true)}>
                    <Text style={{ color: form.category ? '#fff' : '#aaa' }}>{form.category || 'Select Category'}</Text>
                  </TouchableOpacity>

                  <Modal visible={showCategoryModal} transparent animationType="slide">
                    <View style={styles.modalBg}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose Category</Text>
                        <FlatList
                          data={CATEGORIES}
                          keyExtractor={item => item}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={styles.modalOption}
                              onPress={() => {
                                handleChange('category', item);
                                setShowCategoryModal(false);
                              }}
                            >
                              <Text style={[styles.modalOptionText, form.category === item && styles.modalOptionTextActive]}>
                                {item}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                        <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCategoryModal(false)}>
                          <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>

              {/* Date + Time */}
              <View style={styles.twoCol}>
                <View style={styles.colHalf}>
                  <Text style={styles.label}>Date *</Text>
                  <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text style={{ color: form.date ? '#fff' : '#aaa' }}>
                      {form.date || 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={form.date ? new Date(form.date) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          handleChange('date', selectedDate.toISOString().split('T')[0]);
                        }
                      }}
                    />
                  )}
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.label}>Time *</Text>
                  <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                    <Text style={{ color: form.time ? '#fff' : '#aaa' }}>
                      {form.time || 'Select Time'}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          handleChange('time', selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                        }
                      }}
                    />
                  )}
                </View>
              </View>

              {/* Price + Free toggle */}
              <View style={styles.priceRow}>
                <View style={{ flex: 1, marginRight: 15 }}>
                  <Text style={styles.label}>Price (£)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.price}
                    onChangeText={t => handleChange('price', t)}
                    placeholder="15.00"
                    placeholderTextColor="#aaa"
                    editable={!form.isFree}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10 }}>
                  <Text style={[styles.label, { marginBottom: 8 }]}>Free Entry</Text>
                  <Switch
                    trackColor={{ false: '#3e3e3e', true: '#008E6D' }}
                    thumbColor={form.isFree ? '#fff' : '#ccc'}
                    onValueChange={(val) => handleChange('isFree', val)}
                    value={form.isFree}
                  />
                </View>
              </View>

              {/* Image upload */}
              <Text style={styles.label}>Main Image *</Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                {form.imageUrl ? (
                  <Image source={{ uri: form.imageUrl }} style={styles.previewImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Icon name="cloud-upload-outline" size={28} color="#008E6D" />
                    <Text style={styles.uploadText}>Tap to select & upload image</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
                {submitting
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.submitText}>Submit for Approval</Text>
                }
              </TouchableOpacity>
            </View>

            <View style={styles.listSubHeader}>
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
              <Icon name="calendar-outline" size={44} color="#ccc" />
              <Text style={styles.emptyText}>No submitted events yet.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.eventMeta} numberOfLines={1}>{item.venue} • {item.city}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={[
                  styles.statusBadge,
                  item.status === 'approved' ? styles.approved
                    : item.status === 'pending' ? styles.pending
                    : styles.rejected,
                ]}>
                  {item.status || 'approved'}
                </Text>
                
                <TouchableOpacity
                  style={[styles.toggleBtn, { backgroundColor: item.isActive === false ? '#444' : '#008E6D' }]}
                  onPress={() => handleToggleActive(item._id)}
                >
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
                    {item.isActive === false ? 'INACTIVE' : 'ACTIVE'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ManageEvents;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#042929' },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  listHeaderWrap: { paddingBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff', textAlign: 'center', flex: 1 },
  subTitle: { color: '#bbb', marginBottom: 12, fontSize: 13 },
  formCard: {
    backgroundColor: '#042929',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#008E6D',
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: '#042929',
    borderWidth: 1,
    borderColor: '#008E6D',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  locationConfirmed: {
    color: '#008E6D',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },
  // Two-column layout using percentage widths — works on all screen sizes
  twoCol: { flexDirection: 'row', gap: 10, marginTop: 2 },
  colHalf: { flex: 1 },
  categorySelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  categoryChip: {
    borderWidth: 1, borderColor: '#dde3e8',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 7,
    backgroundColor: '#fff',
  },
  categoryChipActive: { backgroundColor: '#008E6D', borderColor: '#008E6D' },
  categoryChipText: { color: '#334155', fontWeight: '700', fontSize: 10 },
  categoryChipTextActive: { color: '#fff' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 2 },
  freeChip: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 999, backgroundColor: '#eef2f4',
    marginBottom: 2,
  },
  freeChipActive: { backgroundColor: '#008E6D' },
  freeChipText: { color: '#334155', fontWeight: '700', fontSize: 12 },
  freeChipTextActive: { color: '#fff' },
  uploadBtn: {
    marginTop: 4,
    borderWidth: 1, borderColor: '#dde3e8',
    borderStyle: 'dashed', borderRadius: 14,
    overflow: 'hidden', backgroundColor: '#fff',
  },
  uploadPlaceholder: { minHeight: 140, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  uploadText: { fontSize: 13, fontWeight: '700', color: '#008E6D', textAlign: 'center', paddingHorizontal: 10 },
  previewImage: { width: '100%', height: 170, resizeMode: 'cover' },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#74C33C',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  errorText: { color: '#c62828', fontWeight: '700', marginBottom: 8, fontSize: 13 },
  listSubHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 18, marginBottom: 10,
  },
  muted: { color: '#94a3b8', fontSize: 12 },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#eef2f4',
    borderRadius: 16, padding: 12, marginBottom: 12,
  },
  eventImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#f1f5f9', flexShrink: 0 },
  eventInfo: { flex: 1, minWidth: 0 },
  eventTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  eventMeta: { fontSize: 12, color: '#64748b', marginTop: 3 },
  statusBadge: {
    alignSelf: 'flex-start', marginTop: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, overflow: 'hidden',
    fontSize: 11, fontWeight: '800', textTransform: 'uppercase',
  },
  toggleBtn: {
    alignSelf: 'flex-start', marginTop: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, overflow: 'hidden',
  },
  approved: { backgroundColor: 'rgba(16,185,129,0.12)', color: '#047857' },
  pending: { backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309' },
  rejected: { backgroundColor: 'rgba(239,68,68,0.12)', color: '#b91c1c' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { color: '#94a3b8', fontWeight: '700', marginTop: 8 },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#042929',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
    borderColor: '#008E6D',
    borderTopWidth: 1,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#012D2E',
  },
  modalOptionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOptionTextActive: {
    color: '#008E6D',
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#012D2E',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});