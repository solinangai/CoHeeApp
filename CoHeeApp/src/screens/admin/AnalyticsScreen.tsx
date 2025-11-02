import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';

export default function AnalyticsScreen() {
  const { orders } = useApp();

  // Calculate analytics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Top selling items
  const itemSales: { [key: string]: { name: string; count: number; revenue: number } } = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemSales[item.id]) {
        itemSales[item.id] = {
          name: item.name,
          count: 0,
          revenue: 0,
        };
      }
      itemSales[item.id].count += item.quantity;
      itemSales[item.id].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Category breakdown
  const categoryRevenue: { [key: string]: number } = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.category || 'Other';
      categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity);
    });
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>HK${totalRevenue.toFixed(0)}</Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalOrders}</Text>
            <Text style={styles.metricLabel}>Total Orders</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>HK${averageOrderValue.toFixed(0)}</Text>
            <Text style={styles.metricLabel}>Avg Order Value</Text>
          </View>
        </View>
      </View>

      {/* Top Selling Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 Selling Items</Text>
        {topItems.map((item, index) => (
          <View key={index} style={styles.topItemCard}>
            <View style={styles.topItemRank}>
              <Text style={styles.topItemRankText}>#{index + 1}</Text>
            </View>
            <View style={styles.topItemInfo}>
              <Text style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemStats}>
                {item.count} sold • HK${item.revenue.toFixed(0)} revenue
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Sales by Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sales by Category</Text>
        {Object.entries(categoryRevenue)
          .sort((a, b) => b[1] - a[1])
          .map(([category, revenue]) => {
            const percentage = (revenue / totalRevenue) * 100;
            return (
              <View key={category} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryRevenue}>HK${revenue.toFixed(0)}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}% of total</Text>
              </View>
            );
          })}
      </View>

      {/* Order Status Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Status Distribution</Text>
        {['pending', 'confirmed', 'preparing', 'ready', 'completed'].map(status => {
          const count = orders.filter(o => o.status === status).length;
          const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
          return (
            <View key={status} style={styles.statusCard}>
              <Text style={styles.statusName}>{status.toUpperCase()}</Text>
              <Text style={styles.statusCount}>{count} orders ({percentage.toFixed(0)}%)</Text>
            </View>
          );
        })}
      </View>

      {/* Recent Trends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            📈 Total Sales: HK${totalRevenue.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            🛒 {totalOrders} orders processed
          </Text>
          <Text style={styles.summaryText}>
            💰 Average order: HK${averageOrderValue.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            ⭐ {Object.keys(categoryRevenue).length} active categories
          </Text>
        </View>
      </View>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metricCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  topItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  topItemRank: {
    width: 40,
    height: 40,
    backgroundColor: '#2C1810',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topItemRankText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  topItemStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  categoryRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E85D2C',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4A574',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
  },
  statusCount: {
    fontSize: 14,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
});
