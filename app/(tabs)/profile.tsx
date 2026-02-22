import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize } from '@/constants';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Sign in to access your profile</Text>
          <Button
            mode="contained"
            onPress={() => router.push('/auth/login')}
            style={styles.button}
            buttonColor={Colors.primary}
          >
            Sign In
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/auth/signup')}
            style={styles.button}
          >
            Create Account
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{user.profile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.tier}>
          {user.profile?.member_tier?.toUpperCase() || 'BRONZE'} Member
        </Text>
        <Text style={styles.points}>
          {user.profile?.loyalty_points || 0} Points
        </Text>
      </View>

      <View style={styles.section}>
        <List.Section>
          <List.Item
            title="Order History"
            left={(props) => <List.Icon {...props} icon="history" />}
            onPress={() => router.push('/profile/orders')}
          />
          <List.Item
            title="Addresses"
            left={(props) => <List.Icon {...props} icon="map-marker" />}
            onPress={() => router.push('/profile/addresses')}
          />
          <List.Item
            title="Payment Methods"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            onPress={() => router.push('/profile/payment-methods')}
          />
          <List.Item
            title="Settings"
            left={(props) => <List.Icon {...props} icon="cog" />}
            onPress={() => router.push('/profile/settings')}
          />
        </List.Section>
      </View>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={signOut}
          style={styles.signOutButton}
          textColor={Colors.error}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  guestTitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  tier: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.accent,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    marginBottom: Spacing.xs,
  },
  points: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    opacity: 0.9,
  },
  section: {
    marginTop: Spacing.md,
  },
  button: {
    width: '100%',
    marginBottom: Spacing.md,
    borderRadius: 8,
  },
  footer: {
    padding: Spacing.lg,
  },
  signOutButton: {
    borderRadius: 8,
    borderColor: Colors.error,
  },
});
