import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import CategoryCard from '../components/CategoryCard';
import EventList from '../components/EventList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchEvents, Event } from '../services/eventService';

const BrowseScreen = ({ navigation }: { navigation: any }) => {
  const catedata = [
    { icon: 'musical-notes-outline', label: 'Live Music' },
    { icon: 'headset-outline', label: 'DJ Nightlife' },
    { icon: 'sparkles-outline', label: 'Events' },
    { icon: 'restaurant-outline', label: 'Food & Drink' },
    { icon: 'people-outline', label: 'Clubs' },
    { icon: 'happy-outline', label: 'Comedy' },
  ];

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents({ limit: 100 });
        setEvents(data);
      } catch (error) {
        console.error('Browse load error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryCounts = useMemo(() => {
    return catedata.reduce<Record<string, number>>((acc, item) => {
      acc[item.label] = events.filter(event => event.category === item.label).length;
      return acc;
    }, {});
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return events;
    return events.filter(event => event.category === selectedCategory);
  }, [events, selectedCategory]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: 15,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={{ backgroundColor: '#008E6D', borderRadius: 50, padding: 8 }}
        >
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: '40%' }}>
          <Text style={{ fontSize: 25, fontWeight: '700', color: '#008E6D', marginTop: 20 }}>Browse</Text>
          <Text style={{ fontSize: 12, color: '#555' }}>Explore by category</Text>

          <View style={styles.container}>
            {catedata.map((item, index) => (
              <View key={index} style={{ width: '30%', marginBottom: 20 }}>
                <CategoryCard
                  {...item}
                  count={categoryCounts[item.label] || 0}
                  onPress={() => {
                    setSelectedCategory(item.label);
                    navigation.navigate('Categorydetails', { categoryName: item.label });
                  }}
                />
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#012D2E' }}>
              {selectedCategory === 'All' ? 'All Events' : selectedCategory}
            </Text>
            {loading && <ActivityIndicator size="small" color="#008E6D" />}
          </View>

          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <EventList
                item={item}
                onPress={() => navigation.navigate('Innerevetscreen', { eventId: item._id })}
              />
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
            ListEmptyComponent={!loading ? <Text style={{ color: '#999', marginTop: 12 }}>No events found</Text> : null}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrowseScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
});
