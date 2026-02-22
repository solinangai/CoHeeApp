import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { MenuItem } from '../types';
import MenuItemCard from '../components/MenuItemCard';
import TableHeader from '../components/TableHeader';

interface TableOrderScreenProps {
  onNavigate: (screen: string) => void;
}

export default function TableOrderScreen({ onNavigate }: TableOrderScreenProps) {
  const { 
    currentTableSession, 
    menuItems, 
    addToCart, 
    cart,
    endTableSession,
    showToast 
  } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'food', name: 'Food' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'snacks', name: 'Snacks' },
  ];

  useEffect(() => {
    if (!currentTableSession) {
      Alert.alert(
        'No Active Session',
        'Please scan a table QR code first.',
        [{ text: 'OK', onPress: () => onNavigate('home') }]
      );
      return;
    }

    filterItems();
  }, [selectedCategory, menuItems, currentTableSession]);

  const filterItems = () => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(
        menuItems.filter((item) => item.category === selectedCategory)
      );
    }
  };

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    addToCart(item, quantity);
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const handleViewCart = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'info');
      return;
    }
    onNavigate('cart');
  };

  const handleEndSession = () => {
    Alert.alert(
      'End Table Session',
      'Are you sure you want to end this dining session? Any unpaid items will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: async () => {
            await endTableSession();
            showToast('Session ended', 'success');
            onNavigate('home');
          },
        },
      ]
    );
  };

  if (!currentTableSession) {
    return null;
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <TableHeader
        tableNumber={currentTableSession.tableNumber}
        sessionStartTime={currentTableSession.startedAt}
        onEndSession={handleEndSession}
      />

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuContent}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in this category</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <TouchableOpacity style={styles.floatingCart} onPress={handleViewCart}>
          <View style={styles.cartContent}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.cartText}>View Cart</Text>
            <Text style={styles.cartAmount}>HK${cartTotal.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  categoryContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  categoryButtonActive: {
    backgroundColor: '#6F4E37',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#6F4E37',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartBadge: {
    backgroundColor: '#FFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#6F4E37',
    fontSize: 14,
    fontWeight: '700',
  },
  cartText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  cartAmount: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
