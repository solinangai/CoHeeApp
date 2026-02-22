import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize } from '@/constants';
import { useAuthStore } from '@/store/authStore';

export default function OrderScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order</Text>
        <Text style={styles.subtitle}>
          {user ? `Welcome back, ${user.profile?.full_name || 'Guest'}!` : 'Welcome to CoHeeApp'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Order</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push('/order/menu')}
            style={styles.button}
            buttonColor={Colors.primary}
          >
            Browse Menu
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/order/qr-scan')}
            style={styles.button}
          >
            Scan QR Code (Dine-in)
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Items</Text>
        <Text style={styles.placeholder}>Featured products will appear here</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <Text style={styles.placeholder}>
          {user ? 'Your recent orders will appear here' : 'Sign in to view your order history'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    opacity: 0.9,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    borderRadius: 8,
  },
  placeholder: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.xl,
  },
});
