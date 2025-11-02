import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: Props) {
  const { getCartCount } = useApp();
  const { user } = useAuth();
  const cartCount = getCartCount();

  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('home')}
      >
        <Text style={[styles.icon, activeTab === 'home' && styles.iconActive]}>
          🏠
        </Text>
        <Text style={[styles.label, activeTab === 'home' && styles.labelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Menu Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('menu')}
      >
        <Text style={[styles.icon, activeTab === 'menu' && styles.iconActive]}>
          📋
        </Text>
        <Text style={[styles.label, activeTab === 'menu' && styles.labelActive]}>
          Menu
        </Text>
      </TouchableOpacity>

      {/* Cart Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('cart')}
      >
        <View>
          <Text style={[styles.icon, activeTab === 'cart' && styles.iconActive]}>
            🛒
          </Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.label, activeTab === 'cart' && styles.labelActive]}>
          Cart
        </Text>
      </TouchableOpacity>

      {/* Market Tab - NEW */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('market')}
      >
        <Text style={[styles.icon, activeTab === 'market' && styles.iconActive]}>
          🏪
        </Text>
        <Text style={[styles.label, activeTab === 'market' && styles.labelActive]}>
          Market
        </Text>
      </TouchableOpacity>

      {/* Profile Tab - NEW (replaces Loyalty) */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('profile')}
      >
        <View style={styles.profileIconContainer}>
          {activeTab === 'profile' ? (
            <View style={[styles.profileIcon, styles.profileIconActive]}>
              <Text style={styles.profileText}>
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <View style={styles.profileIcon}>
              <Text style={styles.profileText}>
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.label, activeTab === 'profile' && styles.labelActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: '#666',
  },
  labelActive: {
    color: '#2C1810',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E85D2C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileIconContainer: {
    marginBottom: 4,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconActive: {
    backgroundColor: '#2C1810',
  },
  profileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
