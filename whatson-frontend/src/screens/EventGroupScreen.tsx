import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import EventCard from '../components/EventCard';
import EventList from '../components/EventList';

const EventGroupScreen = ({ route, navigation }) => {
  const { title, type } = route.params;

  // Dummy Data for EventCard (Grid Layout)
  const cardData = [
    { id: '1', title: 'Midnight Jazz', location: 'London', timeLabel: '11PM', image: 'https://picsum.photos/200' },
    { id: '2', title: 'Techno Rave', location: 'Belfast', timeLabel: '12AM', image: 'https://picsum.photos/201' },
    { id: '3', title: 'Summer Fest', location: 'Bristol', timeLabel: '2PM', image: 'https://picsum.photos/202' },
    { id: '4', title: 'Roof Party', location: 'London', timeLabel: '9PM', image: 'https://picsum.photos/203' },
    { id: '5', title: 'Club Night', location: 'Preston', timeLabel: '10PM', image: 'https://picsum.photos/204' },
    { id: '6', title: 'Vibe Session', location: 'London', timeLabel: '8PM', image: 'https://picsum.photos/205' },
  ];

  // Dummy Data for EventList (Vertical Layout)
  const listData = [
    { id: '1', title: 'Neon Underground', venue: 'The Vault', day: 'Tonight', time: '11:00 PM', price: '15', isFree: false, imageUrl: 'https://picsum.photos/209' },
    { id: '2', title: 'Acoustic Coffee', venue: 'The Bean', day: 'Tonight', time: '8:00 PM', isFree: true, imageUrl: 'https://picsum.photos/207' },
    { id: '3', title: 'Retro Arcade', venue: 'Pixel Bar', day: 'Tonight', time: '7:00 PM', price: '10', isFree: false, imageUrl: 'https://picsum.photos/208' },
    { id: '4', title: 'Wine Tasting', venue: 'Velvet Lounge', day: 'Tonight', time: '9:30 PM', price: '45', isFree: false, imageUrl: 'https://picsum.photos/209' },
    { id: '5', title: 'Rooftop Yoga', venue: 'Sky Garden', day: 'Tonight', time: '6:00 PM', isFree: true, imageUrl: 'https://picsum.photos/210' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#008E6D" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingsIcon}>
          <Ionicons name="settings" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        
        {type === 'card' ? (
          <FlatList
            data={cardData}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen')} />
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <EventList item={item} onPress={() => navigation.navigate('Innerevetscreen')} />
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
  container: {
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
    marginLeft: 5,
  },
  settingsIcon: {
    backgroundColor: '#008E6D',
    borderRadius: 50,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#008E6D',
    marginTop: 10,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 15,
    height: 160, // Adjust based on your EventCard height
  },
});