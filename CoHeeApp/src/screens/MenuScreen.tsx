import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { ALL_MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { MenuItem as MenuItemType } from '../types';

export default function MenuScreen() {
  const { addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = ALL_MENU_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.chinese_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderMenuItem = ({ item }: { item: MenuItemType }) => (
    <View style={styles.menuItem}>
      <View style={styles.itemPlaceholder}>
        <Text style={styles.placeholderText}>
          {getCategoryEmoji(item.category)}
        </Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.chinese_name && (
          <Text style={styles.itemChinese}>{item.chinese_name}</Text>
        )}
        <Text style={styles.itemPrice}>HK${item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
      >
        <TouchableOpacity
          style={[
            styles.categoryTab,
            selectedCategory === 'All' && styles.categoryTabActive
          ]}
          onPress={() => setSelectedCategory('All')}
        >
          <Text style={[
            styles.categoryTabText,
            selectedCategory === 'All' && styles.categoryTabTextActive
          ]}>
            All ({ALL_MENU_ITEMS.length})
          </Text>
        </TouchableOpacity>
        
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryTab,
              selectedCategory === category.name && styles.categoryTabActive
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category.name && styles.categoryTabTextActive
            ]}>
              {category.name} ({category.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.menuList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />
    </View>
  );
}

function getCategoryEmoji(category: string): string {
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoryTabs: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  categoryTabActive: {
    backgroundColor: '#2C1810',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  itemPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
  },
  itemChinese: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
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
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
