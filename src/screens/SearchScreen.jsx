import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import EventList from '../components/EventList';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - In a real app, you would filter this based on searchQuery
  const allEvents = [
    {
      id: '1',
      title: 'Neon Underground Techno',
      venue: 'The Vault',
      day: 'Tonight',
      time: '11:00 PM',
      price: '15',
      isFree: false,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNo2_YgUrtP1aGNFH5GTUaArzJXX3EPpzloA&s=crop',
    },
    {
      id: '2',
      title: 'Acoustic Coffee Sessions',
      venue: 'The Roasted Bean',
      day: 'Tomorrow',
      time: '2:00 PM',
      isFree: true,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNo2_YgUrtP1aGNFH5GTUaArzJXX3EPpzloA&sformat&fit=crop',
    },
  ];

  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* <Ionicons name="chevron-back" size={24} color="#111" /> */}
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Search</Text>
        <View style={{ width: 60 }} /> {/* Spacer to balance header */}
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#ffffffde" style={{ marginLeft: 15 }} />
          <TextInput
            placeholder="Search events, venues..."
            placeholderTextColor="#ffffffde"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#ffffffde" style={{ marginRight: 15 }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Section */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery.length > 0 ? 'Search Results' : 'Recommended for you'}
          </Text>
          <Text style={styles.resultsCount}>{filteredEvents.length} found</Text>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventList 
              item={item} 
              onPress={() => navigation.navigate('Innerevetscreen')} 
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>No events found matching "{searchQuery}"</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginLeft: 4,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#012D2E',
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#012D2E', // Matches your DiscoverScreen search bar
    borderRadius: 50,
    height: 45,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#012D2E',
  },
  resultsCount: {
    fontSize: 12,
    color: '#555',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#888',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});