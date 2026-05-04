import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import EventList from '../components/EventList';

const SavedEventsScreen = ({ navigation }) => {
  // Mock data for favorites
  const savedEvents = [
    {
      id: '1',
      title: 'Neon Underground Techno',
      venue: 'The Vault',
      day: 'Tonight',
      time: '11:00 PM',
      price: '15',
      isFree: false,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNo2_YgUrtP1aGNFH5GTUaArzJXX3EPpzloA&s',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Shared Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifCircle}
        >
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Saved Events</Text>
        <Text style={styles.screenSubtitle}>Your favorite events in one place</Text>

        <FlatList
          data={savedEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventList
              item={item}
              onPress={() => navigation.navigate('Innerevetscreen')}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No saved events yet</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

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
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  notifCircle: {
    backgroundColor: '#008E6D',
    borderRadius: 50,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#008E6D',
    marginTop: 20,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  listContainer: {
    paddingVertical: 15,
    paddingBottom: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
});

export default SavedEventsScreen;