import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Order, OrderStatus } from '../../types';

export default function OrdersScreen() {
  const { orders } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: OrderStatus) => {
    const colors: any = {
      pending: '#FF9800',
      confirmed: '#2196F3',
      preparing: '#9C27B0',
      ready: '#4CAF50',
      completed: '#757575',
      cancelled: '#F44336',
    };
    return colors[status] || colors.pending;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Orders Management</Text>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>All ({orders.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Preparing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Ready</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Orders List */}
      {orders.map((order) => (
        <TouchableOpacity
          key={order.id}
          style={styles.orderCard}
          onPress={() => setSelectedOrder(order)}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>{order.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.orderCustomer}>Customer: {order.customer}</Text>
          <Text style={styles.orderItems}>
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.orderTime}>
            {new Date(order.createdAt).toLocaleTimeString()}
          </Text>

          <View style={styles.orderFooter}>
            <Text style={styles.orderAmount}>HK${order.total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Details →</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {/* Order Details Modal would go here */}
      {selectedOrder && (
        <View style={styles.detailsModal}>
          <Text style={styles.detailsTitle}>Order Details</Text>
          <Text style={styles.detailsText}>Order ID: {selectedOrder.id}</Text>
          <Text style={styles.detailsText}>Customer: {selectedOrder.customer}</Text>
          <Text style={styles.detailsText}>Status: {selectedOrder.status}</Text>
          <Text style={styles.detailsText}>Total: HK${selectedOrder.total.toFixed(2)}</Text>
          
          <View style={styles.detailsItems}>
            <Text style={styles.detailsSubtitle}>Items:</Text>
            {selectedOrder.items.map((item, index) => (
              <Text key={index} style={styles.detailsItemText}>
                {item.quantity}x {item.name} - HK${(item.price * item.quantity).toFixed(2)}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedOrder(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
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
  filterTabs: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E85D2C',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#2C1810',
    fontWeight: '600',
  },
  detailsModal: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  detailsItems: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailsSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  detailsItemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#2C1810',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
