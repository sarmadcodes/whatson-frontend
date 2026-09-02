import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';

const NotificationsScreen = ({ navigation }) => {

  const notifications = [
    {
      id: '1',
      title: 'New Event Available',
      message: 'Live music performance near you. Check it out!',
      time: '2h ago',
    },
    {
      id: '2',
      title: 'Booking Confirmed',
      message: 'Your seat for Fashion Show is confirmed.',
      time: '5h ago',
    },
    {
      id: '3',
      title: 'Special Offer',
      message: 'Get 20% off on premium events this weekend.',
      time: '1d ago',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.dot} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>
                    Back
                  </Text>
                </TouchableOpacity>

        <View style={styles.headerRight}>
          {/* <TouchableOpacity style={styles.iconBtn}>
            <Icon name="ellipsis-horizontal" size={18} color="#000" />
          </TouchableOpacity> */}
        </View>
      </View>

      <Text style={styles.screenTitle}>Notifications</Text>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  headerRight: {
    flexDirection: 'row',
  },

  iconBtn: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 15,
    color: '#012D2E',
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#008E75',
    marginRight: 10,
    marginTop: 6,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  message: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  time: {
    fontSize: 10,
    color: '#999',
    marginLeft: 10,
  },
});