import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpSupportScreen = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const supportData = [
    {
      title: 'FAQs',
      meta: 'Quick answers to common questions',
      icon: 'book-outline',
      content: "• How do I reset my password?\nGo to settings and click 'Security'.\n\n• Is my data safe?\nYes, we use industry-standard encryption.\n\n• How do I delete my account?\nContact support via the email below.",
    },
    {
      title: 'Contact Us',
      meta: 'Reach out to our support team',
      icon: 'mail-outline',
      content: "Customer Support Hours:\nMon - Fri: 9:00 AM - 6:00 PM\n\nResponse Time:\nUsually within 24 hours.",
    },
  ];

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Shared Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifCircle}
        >
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Help & Support</Text>
        <Text style={styles.screenSubtitle}>How can we assist you today?</Text>

        <View style={styles.cardContainer}>
          {supportData.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <View key={index} style={[styles.supportCard, isExpanded && styles.expandedCard]}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => toggleExpand(index)}
                  style={styles.cardHeader}
                >
                  <View style={styles.iconBackground}>
                    <Ionicons name={item.icon} size={20} color="white" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardMeta}>{item.meta}</Text>
                  </View>
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#888" 
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.divider} />
                    <Text style={styles.dummyText}>{item.content}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity activeOpacity={0.75} style={styles.emailBtn}>
          <Text style={styles.emailText}>Email: support@whatson.com</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  notifCircle: {
    backgroundColor: '#008E6D',
    borderRadius: 50,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#008E6D',
    marginTop: 20,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  cardContainer: {
    marginTop: 20,
  },
  supportCard: {
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  expandedCard: {
    borderColor: '#008E6D',
    backgroundColor: '#F9FFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconBackground: {
    backgroundColor: '#008E6D',
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#012D2E',
  },
  cardMeta: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  expandedContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  dummyText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
  emailBtn: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 50,
  },
  emailText: {
    color: '#008E6D',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default HelpSupportScreen;