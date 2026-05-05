import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import EventList from '../components/EventList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';

const MapsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const openMap = () => {
  const url = 'https://www.google.com/maps/place/United+Kingdom';
  
  Linking.openURL(url).catch(err =>
    console.error('Failed to open map:', err)
  );
};

  const eventsData = [
    {
      id: '1',
      title: 'Live Irish Session Night',
      venue: 'The Dirty Onion',
      day: 'Tonight',
      time: '10:00 PM',
      isFree: true,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuqLZUQio_aqdqSSyUZ1P8B8OPG5HD8TrQeA&s=crop',
    },
    {
      id: '2',
      title: 'Saturday Night DJ Set',
      venue: 'Promo Night',
      day: 'Tonight',
      time: '9:00 PM',
      price: '30',
      isFree: false,
      imageUrl:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: '3',
      title: 'Night DJ Set',
      venue: 'The Dirty Onion',
      day: 'Tonight',
      time: '10:00 PM',
      price: '20',
      isFree: false,
      imageUrl:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop',
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: 10,
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

      <FlatList
        data={eventsData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventList
            item={item}
            onPress={() => navigation.navigate('Innerevetscreen')}
          />
        )}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 15 }}
        ListHeaderComponent={() => (
          <View style={{ paddingBottom: 10 }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: '700',
                color: '#008E6D',
                marginTop: 20,
              }}
            >
              Map
            </Text>

            {/* Search Bar Section */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#ffffffde"
                  style={{ marginLeft: 15 }}
                />
                <TextInput
                  placeholder="Search events, venues..."
                  placeholderTextColor="#ffffffde"
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  // autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color="#ffffffde"
                      style={{ marginRight: 15 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.75}
              onPress={openMap}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 10,
                overflow: 'hidden',
                marginVertical: 15,
              }}
            >
              <Image
                source={require('../assets/map.png')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <Text style={{ fontSize: 16, fontWeight: '700', color: '#012D2E' }}>
              {eventsData.length} Events Nearby
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default MapsScreen;

const styles = StyleSheet.create({
  searchContainer: {
    // paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#012D2E', 
    borderRadius: 50,
    height: 45,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
