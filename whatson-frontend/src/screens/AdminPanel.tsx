import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Substitute with real icons in your project (e.g., Ionicons, MaterialIcons)
// import Ionicons from '@react-native-vector-icons/ionicons';
// import MaterialIcons from '@react-native-vector-icons/material-icons';

// Placeholder Component for Icons (Substitute with real ones)
const DummyIcon = ({ size, color, name }) => (
  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.5, color: THEME.TEXT_LIGHT }}>?</Text>
  </View>
);

// Theme Definitions from Design
const THEME = {
  BACKGROUND_DARK: '#012D2E', // Deep Teal
  BACKGROUND_LIGHT: '#fff',
  PRIMARY_GREEN: '#008E6D', // Vibrant Green for accents
  TAB_BAR_GREEN: '#008E6D',
  TEXT_LIGHT: '#ffffffde',
  TEXT_DARK: '#111',
  CARD_BACKGROUND: '#012D2E', // Used for metric cards and growth card
  VENUE_CARD_BG: '#012D2E',
  SEGMENT_BG: '#012D2E',
  SUBTEXT: '#ffffffde',
  STATUS_GREEN: '#00BA92', // Specific active green
  STATUS_GREY: '#83A5A5', // Pending grey
  BORDER: '#eee',
};

const AdminPanelScreen = ({ navigation }) => {
  const [activeSegment, setActiveSegment] = useState('Overview');

  // Stats Data from Design
  const statsData = [
    { label: 'This Week', value: '50', icon: 'storefront', meta: '+ 10' },
    { label: 'Today', value: '100', icon: 'assignment', meta: '+ 23' },
    { label: 'This Week', value: '45,786', icon: 'people', meta: '+ 1500' },
    { label: 'vs Last week', value: '20.5k', icon: 'visibility', meta: '+ 23' },
  ];

  // Venues Data from Design
  const venuesData = [
    {
      id: '1',
      title: 'The Dirty Onion Belfast',
      events: '5 events',
      time: 'Tonight - 9:00 PM',
      status: 'Active',
      image: 'https://pic.onlinewebfonts.com/svg/img_131109.png' // Replace with proper placeholder image URL
    },
    {
      id: '2',
      title: 'Limelight Belfast',
      events: '8 events',
      time: 'Tonight - 9:00 PM',
      status: 'Active',
      image: 'https://pic.onlinewebfonts.com/svg/img_131109.png'
    },
    {
      id: '3',
      title: 'The Black Box Belfast',
      events: '2 events',
      time: 'Tonight - 10:00 PM',
      status: 'Pending',
      image: 'https://pic.onlinewebfonts.com/svg/img_131109.png'
    },
    {
      id: '4',
      title: 'The Spaniard Belfast',
      events: '1 event',
      time: 'Tonight - 11:00 PM',
      status: 'Pending',
      image: 'https://pic.onlinewebfonts.com/svg/img_131109.png'
    },
  ];

  // Placeholder Bar Chart Component
  const DummyChart = () => {
    // Height simulation for bar chart data
    const barHeights = [20, 30, 25, 45, 40, 35, 38, 50, 60, 58, 65, 55];
    return (
      <View style={styles.chartBarsContainer}>
        {barHeights.map((height, index) => (
          <View key={index} style={[styles.chartBar, { height: `${height}%` }]} />
        ))}
      </View>
    );
  };

  // Header Component (Matches other screens)
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={THEME.TEXT_DARK} />
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('NotificationSettings')}
      style={styles.settingsCircle}>
        <Ionicons name="settings" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Stats Card Component
  const StatCard = ({ item }) => (
    <View style={styles.statCard}>
      <View style={styles.statIconHeader}>
        <Ionicons name={item.icon} size={20} color={THEME.STATUS_GREEN} />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statMeta}>{`${item.meta} ${item.label}`}</Text>
    </View>
  );

  // Venue Item Component
  const VenueItem = ({ item }) => (
    <View style={styles.venueItem}>
      <View style={styles.venueItemContent}>
        <Image source={{ uri: item.image }} style={styles.venueImage} resizeMode='cover' />
        <View style={styles.venueDetails}>
          <Text style={styles.venueTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.venueEvents}>{item.events}</Text>
          <Text style={styles.venueTime}>{item.time}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? THEME.STATUS_GREEN : THEME.STATUS_GREY }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.BACKGROUND_LIGHT} />
      
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Admin Panel</Text>
        
        {/* Segment Control */}
        <View style={styles.segmentContainer}>
          {['Overview', 'Venues', 'Categories', 'Cities'].map(segment => (
            <TouchableOpacity 
              key={segment} 
              onPress={() => setActiveSegment(segment)} 
              style={[styles.segmentItem, activeSegment === segment && styles.segmentItemActive]}
            >
              <Text style={[styles.segmentText, activeSegment === segment && styles.segmentTextActive]}>{segment}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metric Cards Grid */}
        <View style={styles.statsGrid}>
          {statsData.map((item, index) => (
            <StatCard key={index} item={item} />
          ))}
        </View>

        {/* Growth Card */}
        <View style={styles.growthCard}>
          <View style={styles.growthHeader}>
            <Ionicons name="trending-up" size={24} color={THEME.STATUS_GREEN} />
            <Text style={styles.growthTitle}>Platform Growth</Text>
          </View>
          <View style={styles.chartContainer}>
            <DummyChart />
          </View>
        </View>

        {/* Recent Venues Section */}
        <Text style={styles.sectionTitle}>Recent Venues</Text>
        <FlatList
          data={venuesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VenueItem item={item} />}
          contentContainerStyle={{ paddingBottom: 120 }} // Pad for bottom tabs
          scrollEnabled={false} // FlatList inside ScrollView workaround
        />
      </ScrollView>

    </SafeAreaView>
  );
};

// Stylesheet Matching Design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.BACKGROUND_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: THEME.BACKGROUND_LIGHT,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.TEXT_DARK,
  },
  settingsCircle: {
    backgroundColor: THEME.PRIMARY_GREEN,
    borderRadius: 50,
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: THEME.PRIMARY_GREEN,
    marginTop: 15,
    marginBottom: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.SEGMENT_BG,
    borderRadius: 8,
    padding: 4,
    marginBottom: 15,
    gap: 2,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentItemActive: {
    backgroundColor: THEME.PRIMARY_GREEN,
  },
  segmentText: {
    color: THEME.TEXT_LIGHT,
    fontSize: 12,
    fontWeight: '500',
  },
  segmentTextActive: {
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 15,
  },
  statCard: {
    width: '47.5%', // Near half width considering gap
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 15,
  },
  statIconHeader: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.TEXT_LIGHT,
    marginBottom: 4,
  },
  statMeta: {
    fontSize: 10,
    color: THEME.SUBTEXT,
  },
  growthCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  growthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.TEXT_LIGHT,
  },
  chartContainer: {
    height: 100, // Matching bar chart height
    justifyContent: 'flex-end',
  },
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  chartBar: {
    width: 12, // Standard bar width
    backgroundColor: THEME.STATUS_GREEN, // Vivid growth green
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.TEXT_DARK,
    marginBottom: 15,
  },
  venueItem: {
    backgroundColor: THEME.VENUE_CARD_BG,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  venueItemContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  venueImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333', // Dummy background
  },
  venueDetails: {
    flex: 1,
    paddingHorizontal: 15,
  },
  venueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.TEXT_LIGHT,
    marginBottom: 2,
  },
  venueEvents: {
    fontSize: 10,
    color: THEME.SUBTEXT,
    marginBottom: 2,
  },
  venueTime: {
    fontSize: 10,
    color: THEME.SUBTEXT,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.TAB_BAR_GREEN,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
});

export default AdminPanelScreen;