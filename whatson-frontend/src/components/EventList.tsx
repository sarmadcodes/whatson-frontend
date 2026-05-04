import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const EventList = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.75} onPress={onPress}>
      {/* Event Image */}
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />

      {/* Center Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subText}>{item.venue}</Text>
        <Text style={styles.subText}>
          {item.day} • {item.time}
        </Text>
      </View>

      {/* Right Action/Badge */}
      <View style={styles.rightContainer}>
        {item.isFree ? (
          <View style={styles.freeBadge}>
            <Text style={styles.ticketIcon}>🎫</Text>
            <Text style={styles.freeText}>Free Entry</Text>
          </View>
        ) : (
          <Text style={styles.priceText}>£ {item.price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#012D2E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    // marginHorizontal: 16,
  },
  eventImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  subText: {
    color: '#ddd', // Lighter grey-teal
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  freeText: {
    color: '#ffffffde',
    fontSize: 9,
    fontWeight: '500',
  },
  priceText: {
    color: '#ffffffde',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EventList;