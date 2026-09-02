import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';

type CategoryCardProps = {
  icon: string;
  label: string;
  count?: number;
  size?: number;
  onPress?: () => void;
};

const CategoryCard = ({ icon, label, count, size = 60, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.8}>
      
      <View style={[styles.card, { width: size, height: size }]}>
        <Icon name={icon} size={size * 0.35} color="#fff" />
      </View>

      <Text style={styles.label}>{label}</Text>

      {count !== undefined && (
        <Text style={styles.count}>{count}</Text>
      )}

    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center', marginTop:5
  },
  card: {
    backgroundColor: '#012D2E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#012D2E',
    fontSize: 12,
    textAlign: 'center',
  },
  count: {
    color: '#333',
    fontSize: 10,
    marginTop: 2,
  },
});