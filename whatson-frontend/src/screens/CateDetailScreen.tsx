import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import EventCard from '../components/EventCard';
import Ionicons from '@react-native-vector-icons/ionicons';

const CategoryDetailScreen = ({ route, navigation }) => {
  // Extract the category name from params
  const { categoryName } = route.params;

  // Comprehensive dummy data
  const allEvents = [
    { id: '1', title: 'Live Rock Concert', category: 'Live Music', image: 'https://picsum.photos/200', location: 'London', timeLabel: '8PM' },
    { id: '2', title: 'Jazz Night', category: 'Live Music', image: 'https://picsum.photos/201', location: 'Belfast', timeLabel: '7PM' },
    { id: '3', title: 'Techno Underground', category: 'DJ Nightlife', image: 'https://picsum.photos/202', location: 'Manchester', timeLabel: '11PM' },
    { id: '4', title: 'House Mix 101', category: 'DJ Nightlife', image: 'https://picsum.photos/203', location: 'London', timeLabel: '10PM' },
    { id: '5', title: 'Standup Special', category: 'Comedy', image: 'https://picsum.photos/204', location: 'Bristol', timeLabel: '6PM' },
    { id: '6', title: 'Street Food Fest', category: 'Food & drink', image: 'https://picsum.photos/205', location: 'London', timeLabel: '1PM' },
  ];

  // Filter logic: Only show events matching the category
  const filteredEvents = allEvents.filter(event => event.category === categoryName);

  return (
    <View style={styles.container}>
      <ScreenWrapper
        imageSource={require('../assets/homebg.png')}
        backgroundColor="#FFFFFF"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <View style={{ width: 40 }} /> {/* Spacer for centering */}
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{categoryName} Near You</Text>
          
          {filteredEvents.length > 0 ? (
            <FlatList
              data={filteredEvents}
              keyExtractor={(item) => item.id}
              numColumns={2} // Grid layout
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                    <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen')} />
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
    width: '48%', // Ensures 2 items per row
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
  }
});