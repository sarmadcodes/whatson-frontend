import React, { useState, useEffect } from 'react';
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
import Icon from '../components/Icon';
import { fetchMyEvents, Event } from '../services/eventService';

const THEME = {
  BACKGROUND_DARK: '#012D2E',
  BACKGROUND_LIGHT: '#fff',
  PRIMARY_GREEN: '#008E6D',
  TAB_BAR_GREEN: '#008E6D',
  TEXT_LIGHT: '#ffffffde',
  TEXT_DARK: '#111',
  CARD_BACKGROUND: '#042929', 
  VENUE_CARD_BG: '#042929',
  SEGMENT_BG: '#042929',
  SUBTEXT: '#ffffffde',
  STATUS_GREEN: '#00BA92', 
  STATUS_GREY: '#83A5A5', 
  BORDER: '#eee',
};

const VenueAdminScreen = ({ navigation }: { navigation: any }) => {
  const [activeSegment, setActiveSegment] = useState('Overview');
  const [stats, setStats] = useState({
    totalEvents: 0,
    approvedEvents: 0,
    pendingEvents: 0,
    cities: [] as string[],
  });
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  const loadStats = async () => {
    try {
      const events = await fetchMyEvents();
      const approved = events.filter(e => e.status === 'approved');
      const pending = events.filter(e => e.status === 'pending');
      setMyEvents(events);
      setStats({
        totalEvents: events.length,
        approvedEvents: approved.length,
        pendingEvents: pending.length,
        cities: [...new Set(events.map(e => e.city).filter(Boolean))],
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (stats.approvedEvents === 0 && stats.totalEvents > 0) {
    return (
      <View style={styles.lockedContainer}>
        <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color={THEME.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.lockedTitle}>Admin Panel Locked</Text>
        <Text style={styles.lockedSub}>
          Your admin panel will activate once your first event is approved.
        </Text>
      </View>
    );
  }

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
        <Icon name="chevron-back" size={24} color={THEME.TEXT_DARK} />
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const StatCard = ({ item }: { item: any }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statMeta}>{item.label}</Text>
    </View>
  );

  const VenueItem = ({ item }: { item: Event }) => (
    <View style={styles.venueItem}>
      <View style={styles.venueItemContent}>
        <Image source={{ uri: item.imageUrl }} style={styles.venueImage} resizeMode='cover' />
        <View style={styles.venueDetails}>
          <Text style={styles.venueTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.venueEvents}>{item.city}</Text>
          <Text style={styles.venueTime}>{item.date || ''}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'approved' ? THEME.STATUS_GREEN : THEME.STATUS_GREY }]}>
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
        <Text style={styles.screenTitle}>My Events Admin</Text>
        
        <View style={styles.segmentContainer}>
          {['Overview', 'Events', 'Cities'].map(segment => (
            <TouchableOpacity 
              key={segment} 
              onPress={() => setActiveSegment(segment)} 
              style={[styles.segmentItem, activeSegment === segment && styles.segmentItemActive]}
            >
              <Text style={[styles.segmentText, activeSegment === segment && styles.segmentTextActive]}>{segment}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeSegment === 'Overview' && (
          <View style={styles.statsGrid}>
            <StatCard item={{ label: 'Total Events', value: stats.totalEvents }} />
            <StatCard item={{ label: 'Approved', value: stats.approvedEvents }} />
            <StatCard item={{ label: 'Pending', value: stats.pendingEvents }} />
            <StatCard item={{ label: 'Cities', value: stats.cities.length }} />
          </View>
        )}

        {activeSegment === 'Events' && (
          <FlatList
            data={myEvents}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <VenueItem item={item} />}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={{padding: 20}}>No events yet.</Text>}
          />
        )}

        {activeSegment === 'Cities' && (
          <View style={{ gap: 10 }}>
            {stats.cities.map((city, i) => (
               <View key={i} style={styles.statCard}>
                 <Text style={styles.statValue}>{city}</Text>
               </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.BACKGROUND_LIGHT,
  },
  lockedContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  lockedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20
  },
  lockedSub: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666'
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
    width: '47.5%',
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.TEXT_LIGHT,
    marginBottom: 4,
  },
  statMeta: {
    fontSize: 12,
    color: THEME.SUBTEXT,
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
    backgroundColor: '#333',
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
});

export default VenueAdminScreen;