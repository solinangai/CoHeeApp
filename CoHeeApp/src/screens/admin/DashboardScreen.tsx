import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../../contexts/AppContext';

interface Props {
  onExit: () => void;
}

export default function DashboardScreen({ onExit }: Props) {
  const { orders } = useApp();

  const todayOrders = orders.length;
  const todayRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.exitButton} onPress={onExit}>
          <Text style={styles.exitButtonText}>← Exit Admin</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>HK${todayRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Today's Revenue</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayOrders}</Text>
          <Text style={styles.statLabel}>Orders Today</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>57</Text>
          <Text style={styles.statLabel}>Menu Items</Text>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {orders.slice(0, 5).map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.orderCustomer}>{order.customer}</Text>
            <Text style={styles.orderAmount}>HK${order.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function getStatusStyle(status: string) {
  const styles: any = {
    pending: { backgroundColor: '#FF9800' },
    confirmed: { backgroundColor: '#2196F3' },
    preparing: { backgroundColor: '#9C27B0' },
    ready: { backgroundColor: '#4CAF50' },
    completed: { backgroundColor: '#757575' },
  };
  return styles[status] || styles.pending;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  exitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E85D2C',
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: '1%',
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
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
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E85D2C',
  },
});
