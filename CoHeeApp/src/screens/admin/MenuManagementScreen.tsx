import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ALL_MENU_ITEMS, CATEGORIES } from '../../data/menuData';
import { MenuItem } from '../../types';

export default function MenuManagementScreen() {
  const [menuItems, setMenuItems] = useState(ALL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const toggleAvailability = (itemId: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, available: !item.available }
          : item
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Menu Management</Text>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'All' && styles.categoryTabActive]}
          onPress={() => setSelectedCategory('All')}
        >
          <Text style={[styles.categoryTabText, selectedCategory === 'All' && styles.categoryTabTextActive]}>
            All ({menuItems.length})
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            style={[styles.categoryTab, selectedCategory === cat.name && styles.categoryTabActive]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Text style={[styles.categoryTabText, selectedCategory === cat.name && styles.categoryTabTextActive]}>
              {cat.name} ({cat.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item Name</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Available</Text>
        </View>

        {filteredItems.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <View style={{ flex: 2 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.chinese_name && (
                <Text style={styles.itemChinese}>{item.chinese_name}</Text>
              )}
            </View>
            <Text style={[styles.tableText, { flex: 1 }]}>HK${item.price}</Text>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Switch
                value={item.available !== false}
                onValueChange={() => toggleAvailability(item.id)}
                trackColor={{ false: '#E0E0E0', true: '#D4A574' }}
                thumbColor={item.available !== false ? '#2C1810' : '#999'}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Add New Item Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1810',
    padding: 20,
  },
  categoryTabs: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
  },
  categoryTabActive: {
    backgroundColor: '#2C1810',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  table: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  tableText: {
    fontSize: 14,
    color: '#666',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  itemChinese: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#2C1810',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
