import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import ScreenWrapper from '../components/ScreenWrapper'
import Ionicons from '@react-native-vector-icons/ionicons'

const InnerEventScreen = ({navigation}) => {
  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <ScreenWrapper
        imageSource={require('../assets/eventbg.png')}
        backgroundColor="#FFFFFF"
      >

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: '40%'}}>

            <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}
          style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={18} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tag}>
           <Text style={styles.tagText}>Free Entry</Text>
        </View>
        <Text style={{fontSize:22, fontWeight:'700', color:'#012D2E', marginTop:20}}>Live Music Performance</Text>
        <Text style={styles.subtitle}>Kelly’s Cellars</Text>

        {/* Info */}
          <Text style={styles.info}>Fri, 16th Feb, 2026</Text>
          <Text style={styles.info}>6:00 PM</Text>
          <Text style={styles.info}>55 St George St, Belfast BT1 1...</Text>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry. Lorem ipsum has been the industry's standard dummy text.
          </Text>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center' , paddingVertical:10}}>
                      <Text style={{fontSize:16, fontWeight:'700', color:'#012D2E'}}>Venue Gallery</Text> 
                    {/* <TouchableOpacity>
                      <Text style={{fontSize:12, color:'#111'}}>See more</Text>
                    </TouchableOpacity> */}
                  </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT905pYr4ntcJippPGqDscDtu5TapUYCkD4rQ&s',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaKw_F5QILIa8k1y7uK24XNOH8C5idMGT9Hg&s',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyQLZCEPOksU1G8cVV8TXa1QnFEyLIUJ1EfQ&s',
            ].map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.galleryImg} />
            ))}
          </ScrollView>

          {/* Opening Hours */}
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          {[
            ['Monday', '11:30am - 1am'],
            ['Tuesday', '11:30am - 1am'],
            ['Wednesday', '11:30am - 1am'],
            ['Thursday', '11:30am - 1am'],
            ['Friday', '11:30am - 1am'],
            ['Saturday', '11:30am - 1am'],
            ['Sunday', '11:30am - 1am'],
          ].map((item, i) => (
            <View key={i} style={styles.hoursRow}>
              <Text style={styles.day}>{item[0]}</Text>
              <Text style={styles.time}>{item[1]}</Text>
            </View>
          ))}
          <Image
            source={require('../assets/map.png')}
            style={styles.map}
          />

          <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Directions</Text>
      </TouchableOpacity>


            </View>
         </ScrollView>
    </ScreenWrapper>
    </View>
  )
}

export default InnerEventScreen

const styles = StyleSheet.create({
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, marginBottom:20
  },

  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },

  iconBtn: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: '#ffffffb0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#1DB954',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },

  tagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  info: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },

  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  galleryImg: {
    width: 110,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },

  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  day: {
    fontSize: 12,
    color: '#666',
  },

  time: {
    fontSize: 12,
    color: '#666',
  },

  map: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginTop: 15,
  },
  button: {
    marginVertical:15,
    backgroundColor: '#7AC943',
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

})