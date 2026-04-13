import {
  Button,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({navigation}) => {

  const featureData = [
   { title: 'Saved Events', metaText: 'Your favourite events', tipIcon: 'heart', screen: 'Savedevents' },
   { title: 'Notifications', metaText: 'Manage your alerts', tipIcon: 'notifications', screen: 'NotificationSettings' },
   { title: 'Location', metaText: 'Belfast, Northern Ireland', tipIcon: 'location', screen: 'Locationscreen' },
   { title: 'Share App', metaText: 'Tell friends about Whats On', tipIcon: 'share-sharp', screen: '' },
  //  { title: 'Install App', metaText: 'Add to home screen', tipIcon: 'download', screen: '' },
   { title: 'help & Support', metaText: 'FAQs and contact', tipIcon: 'help-outline', screen: 'HelpSupport' },
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
            Profile
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
              marginTop:12
            }}
          >
            <Image
              source={require('../assets/onboard3.png')}
              style={styles.profilepic}
            />
            <View>
              <Text style={styles.fullname}>Full Name</Text>
              <Text style={styles.userdata}>@Username</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate('Editprofile')}
           style={{backgroundColor:'#008E6D', padding:10, borderRadius:50, flexDirection:'row', gap:6, alignItems:'center', justifyContent:'center', marginVertical:5}}>
            <Ionicons name='pencil' size={15} color='#fff' />
            <Text style={{color:'white', fontSize:14, fontWeight:'600', textAlign:'center'}}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:15}}>
            <TouchableOpacity onPress={() => navigation.navigate('Loginscreen')}
            activeOpacity={0.75} style={styles.logincardbtn}>
              <Ionicons name='person-circle' size={25} color='#ffffffde' />
              <Text style={styles.btntext}>Venue Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Adminpanel')}
            activeOpacity={0.75} style={styles.logincardbtn}>
              <Ionicons name='tv-sharp' size={25} color='#ffffffde' />
              <Text style={styles.btntext}>Admin Panel</Text>
            </TouchableOpacity>
          </View>

          {featureData.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.tipCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.tipicon}><Ionicons name={item.tipIcon} size={20} color='#ffffffde' /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.tipTime}>{item.metaText}</Text>
              </View>
              <Text style={styles.arrowIcon}>〉</Text>
            </TouchableOpacity>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profilepic: { width: 75, height: 75, borderRadius: 50, borderWidth: 1 },
  fullname: { fontSize: 18, fontWeight: '600', letterSpacing: 0.75 },
  userdata: { fontSize: 12, fontWeight: '500', letterSpacing: 0.66 },

  logincardbtn: {
    backgroundColor:'#012D2E',
    alignItems:'center',
    padding:20, 
    borderRadius:8,
    width:'45%'
  },
  btntext : {
    fontSize:14,
    fontWeight:'600', 
    color:'#ffffffde',
    marginVertical:3,
  },

  tipCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, marginVertical:10, borderWidth: 1, borderColor:'#ddd' },
  tipTitle: { fontSize: 14, fontWeight: '700', color:"#012D2E" },
  tipTime: { fontSize: 10, marginTop: 2, color:'#012d2ede' },
  arrowIcon: { fontSize: 12, color:'#888' },
  tipicon : { borderRadius:50, backgroundColor:'#008E6D', padding:8, marginRight:7}

});
