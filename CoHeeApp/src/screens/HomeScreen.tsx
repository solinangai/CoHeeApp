import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { FEATURED_ITEMS, CATEGORIES } from '../data/menuData';

interface Props {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  const { addToCart, getUserActiveOrders } = useApp();
  const { user } = useAuth();

  const activeOrders = getUserActiveOrders();

  const getOrderStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order has been received';
      case 'confirmed':
        return 'Your order has been confirmed';
      case 'preparing':
        return 'Your order is being prepared';
      case 'ready':
        return 'Your order is ready for pickup!';
      default:
        return 'Processing your order';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '📋';
      case 'confirmed':
        return '✅';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '🎉';
      default:
        return '⏳';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Active Order Banner - Only for logged-in users with active orders */}
      {user && activeOrders.length > 0 && (
        <TouchableOpacity
          style={styles.orderBanner}
          onPress={() => onNavigate('orderStatus')}
          activeOpacity={0.8}
        >
          <View style={styles.orderBannerContent}>
            <View style={styles.orderBannerLeft}>
              <Text style={styles.orderBannerIcon}>
                {getOrderStatusIcon(activeOrders[0]?.status || 'pending')}
              </Text>
              <View style={styles.orderBannerText}>
                <Text style={styles.orderBannerTitle}>
                  Order {activeOrders[0]?.id}
                </Text>
                <Text style={styles.orderBannerSubtitle}>
                  {getOrderStatusMessage(activeOrders[0]?.status || 'pending')}
                </Text>
              </View>
            </View>
            <Text style={styles.orderBannerArrow}>→</Text>
          </View>
          {activeOrders.length > 1 && (
            <View style={styles.orderBadge}>
              <Text style={styles.orderBadgeText}>
                +{activeOrders.length - 1} more
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>CoHee</Text>
          <Text style={styles.subtitle}>Japanese Yatai @ Science Park</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => onNavigate('menu')}
        >
          <Text style={styles.quickActionIcon}>🍱</Text>
          <Text style={styles.quickActionText}>Order Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => onNavigate('market')}
        >
          <Text style={styles.quickActionIcon}>🛍️</Text>
          <Text style={styles.quickActionText}>Shop Market</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => onNavigate('cart')}
        >
          <Text style={styles.quickActionIcon}>🛒</Text>
          <Text style={styles.quickActionText}>View Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Today</Text>
          <TouchableOpacity onPress={() => onNavigate('menu')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredList}
        >
          {FEATURED_ITEMS.map((item) => (
            <View key={item.id} style={styles.featuredItem}>
              <View style={styles.featuredImage}>
                <Text style={styles.featuredEmoji}>🍱</Text>
              </View>
              <Text style={styles.featuredName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.chinese_name && (
                <Text style={styles.featuredChinese} numberOfLines={1}>
                  {item.chinese_name}
                </Text>
              )}
              <Text style={styles.featuredPrice}>HK${item.price}</Text>
              <TouchableOpacity
                style={styles.featuredAddButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.featuredAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => onNavigate('menu')}
            >
              <Text style={styles.categoryEmoji}>
                {category.name === 'Coffee'
                  ? '☕'
                  : category.name === 'Beverages'
                  ? '🍵'
                  : category.name === 'Sandwich'
                  ? '🥪'
                  : category.name === 'Rice Bowl'
                  ? '🍚'
                  : category.name === 'Sides'
                  ? '🍗'
                  : category.name === 'Pasta'
                  ? '🍝'
                  : '🍰'}
              </Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} items</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Special Offer */}
      <View style={styles.offerCard}>
        <Text style={styles.offerBadge}>🎓 HKSTP Staff</Text>
        <Text style={styles.offerTitle}>Get 10% Off</Text>
        <Text style={styles.offerText}>
          Show your staff ID to enjoy exclusive discount on all orders
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  orderBanner: {
    backgroundColor: '#2C1810',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderBannerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  orderBannerText: {
    flex: 1,
  },
  orderBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  orderBannerSubtitle: {
    fontSize: 14,
    color: '#D4A574',
  },
  orderBannerArrow: {
    fontSize: 24,
    color: '#D4A574',
  },
  orderBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 165, 116, 0.3)',
  },
  orderBadgeText: {
    fontSize: 12,
    color: '#D4A574',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#2C1810',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  seeAll: {
    fontSize: 14,
    color: '#E85D2C',
    fontWeight: '600',
  },
  featuredList: {
    paddingLeft: 20,
  },
  featuredItem: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  featuredImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredEmoji: {
    fontSize: 40,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  featuredChinese: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E85D2C',
    marginBottom: 8,
  },
  featuredAddButton: {
    backgroundColor: '#2C1810',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  featuredAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  offerCard: {
    backgroundColor: '#FFF8F0',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4A574',
  },
  offerBadge: {
    fontSize: 16,
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  offerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
