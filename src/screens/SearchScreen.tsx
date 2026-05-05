import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import EventList from '../components/EventList';
import { fetchEvents, Event } from '../services/eventService';

const SearchScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const [searchQuery, setSearchQuery] = useState(route?.params?.query || '');
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const data = await fetchEvents({ search: query, limit: 100 });
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchNow = async () => {
    const query = searchQuery.trim();
    if (!query) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await fetchEvents({ search: query, limit: 100 });
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={{ backgroundColor: '#008E6D', borderRadius: 50, padding: 8 }}
        >
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 20, marginBottom: 10 }}>Search</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#ffffffde" style={{ marginLeft: 15 }} />
          <TextInput
            placeholder="Search events, venues..."
            placeholderTextColor="#ffffffde"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setResults([]); setSearched(false); }}>
              <Ionicons name="close-circle" size={20} color="#ffffffde" style={{ marginRight: 15 }} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={handleSearchNow} style={{ marginTop: 10, alignSelf: 'flex-end' }}>
          <Text style={{ color: '#008E6D', fontWeight: '700' }}>Search now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#008E6D" style={{ marginTop: 50 }} />
        ) : (
          <>
            {searched && (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>{results.length > 0 ? 'Results' : 'No results found'}</Text>
                <Text style={styles.resultsCount}>{results.length} found</Text>
              </View>
            )}
            <FlatList
              data={results}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <EventList item={item} onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })} />
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() =>
                searched ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>No events found for "{searchQuery}"</Text>
                  </View>
                ) : null
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backText: { fontSize: 16, fontWeight: '700', color: '#111' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#012D2E', borderRadius: 50, height: 45, marginBottom: 10 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 10 },
  resultsContainer: { flex: 1, paddingHorizontal: 15, marginTop: 10 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  resultsTitle: { fontSize: 18, fontWeight: '700', color: '#012D2E' },
  resultsCount: { fontSize: 12, color: '#555' },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#888', marginTop: 10, fontSize: 14, textAlign: 'center' },
});
