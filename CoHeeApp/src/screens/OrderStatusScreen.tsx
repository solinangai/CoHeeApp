import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Order, OrderStatus } from '../types';

interface Props {
  onNavigate: (screen: string) => void;
}

export default function OrderStatusScreen({ onNavigate }: Props) {
  const { getUserActiveOrders } = useApp();
  const { user } = useAuth();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const activeOrders = getUserActiveOrders();
    if (activeOrders.length > 0) {
      setCurrentOrder(activeOrders[0]);
    } else {
      setCurrentOrder(null);
    }
  }, [user]);

  useEffect(() => {
    if (currentOrder) {
      const progress = getStatusProgress(currentOrder.status);
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [currentOrder]);

  const getStatusProgress = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 0.25;
      case 'confirmed': return 0.5;
      case 'preparing': return 0.75;
      case 'ready': return 1;
      default: return 0;
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Order Received',
          message: 'We have received your order',
          icon: '📋',
          color: '#FF9800',
        };
      case 'confirmed':
        return {
          title: 'Order Confirmed',
          message: 'Your order has been confirmed',
          icon: '✅',
          color: '#2196F3',
        };
      case 'preparing':
        return {
          title: 'Preparing Your Order',
          message: 'Our kitchen is working on your order',
          icon: '👨‍🍳',
          color: '#9C27B0',
        };
      case 'ready':
        return {
          title: 'Ready for Pickup!',
          message: 'Your order is ready at Building 17W',
          icon: '🎉',
          color: '#4CAF50',
        };
      default:
        return {
          title: 'Processing',
          message: 'Please wait...',
          icon: '⏳',
          color: '#999',
        };
    }
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔐</Text>
        <Text style={styles.emptyTitle}>Please Login</Text>
        <Text style={styles.emptyText}>
          You need to be logged in to view order status
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => onNavigate('login')}
        >
          <Text style={styles.shopButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>No active orders</Text>
        <Text style={styles.emptyText}>
          You don't have any active orders at the moment
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => onNavigate('menu')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(currentOrder.status);
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('home')}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Status Icon */}
      <View style={styles.statusIconContainer}>
        <View style={[styles.statusIcon, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusIconText}>{statusInfo.icon}</Text>
        </View>
        <Text style={styles.statusTitle}>{statusInfo.title}</Text>
        <Text style={styles.statusMessage}>{statusInfo.message}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: progressWidth, backgroundColor: statusInfo.color }
            ]} 
          />
        </View>
        <View style={styles.progressSteps}>
          <View style={styles.progressStep}>
            <Text style={styles.progressStepText}>Received</Text>
          </View>
          <View style={styles.progressStep}>
            <Text style={styles.progressStepText}>Confirmed</Text>
          </View>
          <View style={styles.progressStep}>
            <Text style={styles.progressStepText}>Preparing</Text>
          </View>
          <View style={styles.progressStep}>
            <Text style={styles.progressStepText}>Ready</Text>
          </View>
        </View>
      </View>

      {/* Order Details */}
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderLabel}>Order ID</Text>
          <Text style={styles.orderId}>{currentOrder.id}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer</Text>
            <Text style={styles.infoValue}>{currentOrder.customer}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pickup Time</Text>
            <Text style={styles.infoValue}>{currentOrder.pickupTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Amount</Text>
            <Text style={styles.infoValue}>HK${currentOrder.total.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment</Text>
            <Text style={styles.infoValue}>{currentOrder.paymentMethod || 'Paid'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.itemsTitle}>Order Items</Text>
        {currentOrder.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>HK${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Pickup Location */}
      <View style={styles.locationCard}>
        <Text style={styles.locationTitle}>📍 Pickup Location</Text>
        <Text style={styles.locationAddress}>Building 17W</Text>
        <Text style={styles.locationSubtext}>Hong Kong Science Park</Text>
        <Text style={styles.locationSubtext}>Pak Shek Kok, New Territories</Text>
      </View>

      {/* Action Button */}
      {currentOrder.status === 'ready' ? (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            // TODO: Add help/support functionality
          }}
        >
          <Text style={styles.helpButtonText}>Need Help?</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  closeButton: {
    fontSize: 28,
    color: '#2C1810',
  },
  statusIconContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconText: {
    fontSize: 48,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
  },
  progressStepText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  orderInfo: {},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#2C1810',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: '#2C1810',
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 12,
    color: '#666',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#2C1810',
  },
  helpButtonText: {
    color: '#2C1810',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F5F5F5',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#2C1810',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
