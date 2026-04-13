import { FlatList, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import FilterGroup from '../components/FilterGroup';
import EventCard from '../components/EventCard';
import Ionicons from '@react-native-vector-icons/ionicons';
import EventList from '../components/EventList'
import CategoryCard from '../components/CategoryCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const DiscoverScreen = ({ navigation }) => {

  const catedata = [
    { icon: 'musical-notes-outline', label: 'Live Music' },
    { icon: 'headset-outline', label: 'DJ Nightlife' },
    { icon: 'sparkles-outline', label: 'Events' },
    { icon: 'restaurant-outline', label: 'Food & drink' },
    { icon: 'people-outline', label: 'Clubs' },
    { icon: 'happy-outline', label: 'Comedy' },
  ];

  const myFilters = [
    { id: 1, name: 'All' },
    { id: 2, name: 'Today' },
    { id: 3, name: 'Tonight' },
    { id: 5, name: 'This Week' },
  ];

   const eventsData = [
    {
      id: '1',
      title: 'Live Irish Session Night',
      venue: 'The Dirty Onion',
      day: 'Tonight',
      time: '8:00 PM',
      isFree: true,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuqLZUQio_aqdqSSyUZ1P8B8OPG5HD8TrQeA&s',
    },
    {
      id: '2',
      title: 'Saturday Night DJ Set',
      venue: 'The Dirty Onion',
      day: 'Tonight',
      time: '9:00 PM',
      price: '39',
      isFree: false,
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: '3',
      title: 'Night DJ Set',
      venue: 'The Dirty Onion',
      day: 'Tonight',
      time: '10:00 PM',
      price: '39',
      isFree: false,
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop',
    },
  ];

  const events = [
    {
      id: '1',
      title: 'DJ Set',
      image: 'https://picsum.photos/200',
      location: 'Belfast',
      timeLabel: '9PM',
      category: 'Clubs',
      // price: '£5',
      // extraTag: 'Food',
    },
    {
      id: '2',
      title: 'Live Music',
      image: 'https://picsum.photos/201',
      location: 'London',
      timeLabel: '11PM',
      category: 'Live',
    }, // No price = Simple version
    {
      id: '3',
      title: 'Live Music',
      image: 'https://picsum.photos/201',
      location: 'Bristol',
      timeLabel: '8PM',
      category: 'Live',
    }, // No price = Simple version

  ];

  const eventstwo = [
    {
      id: '1',
      title: 'DJ Set',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDY2fMwB_OHzghcLhiXT75tHlEPXwgoUIF0g&s',
      location: 'Preston',
      timeLabel: '12AM',
      category: 'DJ',
      price: '£8',
      extraTag: 'Drinks',
    }, 
    {
      id: '2',
      title: 'Birthday party',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStcYt1yuor-sTThbPLJzTBJPS1QmcggZJMig&s',
      location: 'Winchester',
      timeLabel: '10PM',
      category: 'Party',
      price: '£0',
      extraTag: 'Dinner',
    }, 
  ];
   const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <ScreenWrapper
        imageSource={require('../assets/homebg.png')}
        backgroundColor="#FFFFFF"
      >

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: '40%'}}>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:5}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
            <Ionicons name='pin-sharp' size={20} color='red' />
            <View><Text style={{fontSize:16, fontWeight:'700', color:'#fff'}}>Location</Text> 
            <Text style={{fontSize:12, fontWeight:'400', color:'#ffffffde'}}>London, United Kingdom</Text></View>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}
           style={{backgroundColor:'#74C33C', borderRadius:50, padding:8}}>
            <Ionicons name='notifications' size={20} color='white' />
          </TouchableOpacity>
        </View>

        

        <Text style={{fontSize:25, fontWeight:'700', color:'#012D2E', marginTop:20}}>Discover</Text>
        <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#ffffffde" style={{ marginLeft: 15 }} />
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
                      <Ionicons name="close-circle" size={20} color="#ffffffde" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

        <FilterGroup items={myFilters} />

        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center' , paddingVertical:5}}>
            <Text style={{fontSize:16, fontWeight:'700', color:'#012D2E'}}>Categories</Text> 
          {/* <TouchableOpacity>
          </TouchableOpacity> */}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{marginBottom:10}}>
          {catedata.map((item, index) => (
            <View key={index} style={{ marginRight: 12 }}>
            <CategoryCard {...item} onPress={() => navigation.navigate('Categorydetails', { categoryName: item.label })} />
            </View>
          ))}
        </ScrollView>


        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center' , paddingVertical:5, marginTop:10}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
            <Text style={{fontSize:16, fontWeight:'700', color:'#012D2E'}}>Featured</Text> 
            <Ionicons name='star' size={15} color='orange' />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Featured', type: 'card' })}>
            <Text style={{fontSize:12, color:'#111'}}>See more</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{height:150}}>
        <FlatList
          horizontal showsHorizontalScrollIndicator={false}
          data={events}
          renderItem={({ item }) => <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen')} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingVertical:5, }}
        /> </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center' , paddingVertical:5, marginTop:10}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
            <Text style={{fontSize:16, fontWeight:'700', color:'#012D2E'}}>Nearby Events</Text> 
            <Ionicons name='star' size={15} color='orange' />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Nearby Events', type: 'card' })}>
            <Text style={{fontSize:12, color:'#111'}}>See more</Text>
          </TouchableOpacity>
        </View>

        <View style={{height:150}}>
        <FlatList
          horizontal showsHorizontalScrollIndicator={false}
          data={eventstwo}
          renderItem={({ item }) => <EventCard data={item} onPress={() => navigation.navigate('Innerevetscreen')} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingVertical:5, }}
        /> </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center' , paddingVertical:5, marginTop:10}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
            <Text style={{fontSize:16, fontWeight:'700', color:'#012D2E'}}>Happening Now</Text> 
            {/* <Ionicons name='star' size={15} color='orange' /> */}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EventGroup', { title: 'Happening Now', type: 'list' })}>
            <Text style={{fontSize:12, color:'#111'}}>See more</Text>
          </TouchableOpacity>
        </View>

        <FlatList
        data={eventsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventList item={item} onPress={() => navigation.navigate('Innerevetscreen')}  />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
        
        </View>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  searchContainer: {
    // paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius:50,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#74C33C', 
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
