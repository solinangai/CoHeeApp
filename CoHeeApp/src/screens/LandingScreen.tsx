import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface Props {
  onNavigate: (screen: any) => void;
}

export default function LandingScreen({ onNavigate }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>CoHee</Text>
        </View>
        <Text style={styles.tagline}>Japanese Yatai @ Science Park</Text>
        <Text style={styles.subtitle}>Premium Coffee & Japanese Cuisine</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>☕</Text>
          <Text style={styles.featureText}>Specialty Coffee</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🍱</Text>
          <Text style={styles.featureText}>Fresh Japanese Food</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureText}>Quick Pickup</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => onNavigate('login')}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => onNavigate('register')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.hkstpBadge}>🎓 HKSTP Staff Get 10% Off</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  tagline: {
    fontSize: 18,
    color: '#D4A574',
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  actions: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#D4A574',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#2C1810',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4A574',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#D4A574',
    fontSize: 18,
    fontWeight: '600',
  },
  hkstpBadge: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
});
