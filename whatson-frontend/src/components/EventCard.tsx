import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Event } from '../services/eventService';

const { width } = Dimensions.get('window');
// Setting width so 2 cards show, and the 3rd peaks (Horizontal scroll)
const CARD_WIDTH = width * 0.44;

interface EventCardProps {
  data: Event | any;
  onPress: () => void;
}

const EventCard = ({ data, onPress }: EventCardProps) => {
  const { imageUrl, image, title, city, location, time, timeLabel, category, price, isFree, extraTag } = data;
  const imgSource = imageUrl || image;
  const locationText = city || location;
  const timeText = time || timeLabel;

  // Auto-detecting if it should show the "Extra Tag" (Price/Food) layout
  const isDetailed = !!extraTag || !!price;

  return (
    <TouchableOpacity 
      activeOpacity={0.75} 
      onPress={onPress} 
      style={styles.cardContainer}
    >
      <ImageBackground
        source={{ uri: imgSource }}
        style={styles.background}
        imageStyle={{ borderRadius: 10 }} // Matches rounded corners in image
      >
        {/* Bottom-to-Top Gradient for text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.gradientOverlay}
        />

        {/* Top Badges */}
        <View style={styles.topRow}>
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
          {isFree && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>Free</Text>
            </View>
          )}
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>📍 {locationText}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>🕒 {timeText}</Text>
            </View>
          </View>

          {isDetailed && (
            <View style={[styles.infoGrid, { marginTop: 4 }]}>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>💰 {price || 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>🍴 {extraTag || 'Drinks'}</Text>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: 140,
    marginRight: 12,
    borderRadius: 10,
    elevation: 2,
  },
  background: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    borderRadius: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#6FCF2D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 50,
  },
  categoryText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  bottomContent: {
    marginTop: 'auto',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 2,
  },
  infoText: {
    color: '#E0E0E0',
    fontSize: 8.5,
    fontWeight: '500',
  },
});

export default EventCard;