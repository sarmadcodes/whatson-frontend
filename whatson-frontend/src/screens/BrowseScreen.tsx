import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import CategoryCard from '../components/CategoryCard';
import EventList from '../components/EventList';
import { SafeAreaView } from 'react-native-safe-area-context';

const BrowseScreen = ({navigation}) => {
  const catedata = [
    { icon: 'musical-notes-outline', label: 'Live Music', count: 8 },
    { icon: 'headset-outline', label: 'DJ Nightlife', count: 10 },
    { icon: 'sparkles-outline', label: 'Events', count: 15 },
    { icon: 'restaurant-outline', label: 'Food & drink', count: 8 },
    { icon: 'people-outline', label: 'Clubs', count: 18 },
    { icon: 'happy-outline', label: 'Comedy', count: 20 },
  ];

  const eventsData = [
  {
    id: '1',
    title: 'Neon Underground Techno',
    venue: 'The Vault',
    day: 'Tonight',
    time: '11:00 PM',
    price: '15',
    isFree: false,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuqLZUQio_aqdqSSyUZ1P8B8OPG5HD8TrQeA&s',
  },
  {
    id: '2',
    title: 'Acoustic Coffee Sessions',
    venue: 'The Roasted Bean',
    day: 'Tomorrow',
    time: '2:00 PM',
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Retro Arcade Tournament',
    venue: 'Pixel Bar',
    day: 'Friday',
    time: '7:00 PM',
    price: '10',
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Jazz & Wine Tasting',
    venue: 'The Velvet Lounge',
    day: 'Saturday',
    time: '8:30 PM',
    price: '45',
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Sunset Rooftop Yoga',
    venue: 'Sky Garden',
    day: 'Sunday',
    time: '6:00 PM',
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop',
  }
];

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
        {/* <Ionicons name='pin-sharp' size={20} color='red' /> */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}
          style={{ backgroundColor: '#008E6D', borderRadius: 50, padding: 8 }}
        >
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: '40%' }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: '700',
              color: '#008E6D',
              marginTop: 20,
            }}
          >
            Browse
          </Text>{' '}
          <Text style={{ fontSize: 12, color: '#555' }}>
            Explore by category
          </Text>
          <View style={styles.container}>
            {catedata.map((item, index) => (
              <View key={index} style={{width:'30%', marginBottom:20}}>
                <CategoryCard {...item} onPress={() => navigation.navigate('Categorydetails', { categoryName: item.label })} />
              </View>
            ))}
          </View>

          <Text style={{fontSize:16, fontWeight:'700', color:'#012D2E',}}>Live Music</Text> 
          <FlatList
        data={eventsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventList item={item} onPress={() => navigation.navigate('Innerevetscreen')} />}
        contentContainerStyle={{ paddingVertical: 10 }}
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
    marginVertical:15
  },
});
