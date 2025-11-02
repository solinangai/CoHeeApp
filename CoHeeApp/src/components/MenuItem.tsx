import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MenuItem as MenuItemType } from '../types';

interface Props {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
}

export default function MenuItem({ item, onPress }: Props) {
  const getCategoryEmoji = (category: string): string => {
    const emojiMap: { [key: string]: string } = {
      'Coffee': '☕',
      'Beverages': '🍵',
      'Sandwich': '🥪',
      'Rice Bowl': '🍚',
      'Sides': '🍗',
      'Pasta': '🍝',
      'Dessert': '🍰',
    };
    return emojiMap[category] || '🍱';
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{getCategoryEmoji(item.category)}</Text>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        {item.chinese_name && (
          <Text style={styles.chineseName}>{item.chinese_name}</Text>
        )}
        <Text style={styles.price}>HK${item.price}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => onPress(item)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
  },
  chineseName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E85D2C',
    marginTop: 4,
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: '#2C1810',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
