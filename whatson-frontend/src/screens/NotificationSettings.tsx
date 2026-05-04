import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationsScreen = () => {

  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
    promotions: true,
  });

  const toggle = key => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.card}>
        <Option label="Push Notifications" value={notifications.push} onChange={() => toggle('push')} />
        <Option label="Email Notifications" value={notifications.email} onChange={() => toggle('email')} />
        <Option label="SMS Alerts" value={notifications.sms} onChange={() => toggle('sms')} />
        <Option label="Events Updates" value={notifications.promotions} onChange={() => toggle('promotions')} />
      </View>
    </SafeAreaView>
  );
};

const Option = ({ label, value, onChange }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      thumbColor={value ? '#008E6D' : '#012D2E'}
      trackColor={{ false: '#E0E0E0', true: '#C0C0C0' }}
    />
  </View>
);

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 20,
    marginVertical: 15,
    fontWeight: '600',
    color: '012D2E',
  },

  card: {
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f2f2f2',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  label: {
    fontSize: 15,
    color: '#555',
  },
});