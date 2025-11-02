import { useAuth } from '../contexts/AuthContext';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { PAYMENT_METHODS } from '../data/menuData';

interface Props {
  onNavigate: (screen: string) => void;
}

export default function CheckoutScreen({ onNavigate }: Props) {
  const { user } = useAuth();
  const { cart, hkstpDiscount, getCartTotal, createOrder, clearCart } = useApp();
  const [pickupTime, setPickupTime] = useState('12:00 PM');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = hkstpDiscount ? subtotal * 0.1 : 0;
  const total = getCartTotal();

  const handlePayment = async (paymentMethod: string) => {
  setSelectedPayment(paymentMethod);
  setIsProcessing(true);

  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
  setOrderId(newOrderId);

  const order = {
    id: newOrderId,
    customer: 'Guest',  // UPDATE THIS LINE
    customerId: user?.id,  // ADD THIS LINE
    items: [...cart],
    subtotal,
    discount,
    total,
    status: 'pending' as const,
    pickupTime,
    specialInstructions,
    createdAt: new Date(),
    paymentMethod,  // ADD THIS LINE
  };

  createOrder(order);
  setIsProcessing(false);
  
  // UPDATE: Navigate to order status instead of showing success screen
  onNavigate('orderStatus');  // CHANGE THIS LINE
};


  if (orderCompleted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Order Placed Successfully!</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Order ID</Text>
          <Text style={styles.orderValue}>{orderId}</Text>
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Pickup Time</Text>
          <Text style={styles.orderValue}>{pickupTime}</Text>
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Total Amount</Text>
          <Text style={styles.orderValue}>HK${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            setOrderCompleted(false);
            onNavigate('home');
          }}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => onNavigate('cart')}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryItemName}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={styles.summaryItemPrice}>
                HK${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>HK${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Pickup Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Time</Text>
          <View style={styles.timeOptions}>
            {['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  pickupTime === time && styles.timeOptionActive
                ]}
                onPress={() => setPickupTime(time)}
              >
                <Text style={[
                  styles.timeOptionText,
                  pickupTime === time && styles.timeOptionTextActive
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Any special requests?"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentButton, { backgroundColor: method.color }]}
              onPress={() => handlePayment(method.id)}
              disabled={isProcessing}
            >
              {isProcessing && selectedPayment === method.id ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.paymentIcon}>{method.icon}</Text>
                  <Text style={styles.paymentText}>{method.name}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItemName: {
    fontSize: 15,
    color: '#666',
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C1810',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E85D2C',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeOptionActive: {
    backgroundColor: '#2C1810',
    borderColor: '#D4A574',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  timeOptionTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 32,
    textAlign: 'center',
  },
  orderInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  orderLabel: {
    fontSize: 16,
    color: '#666',
  },
  orderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  doneButton: {
    backgroundColor: '#2C1810',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
