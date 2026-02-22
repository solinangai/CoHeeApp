import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { AppProvider } from './src/contexts/AppContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import TabBar from './src/components/TabBar';
import Toast from './src/components/Toast';

// Screens
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderStatusScreen from './src/screens/OrderStatusScreen';
import MarketScreen from './src/screens/MarketScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// QR Dine-in Screens
import QRScanScreen from './src/screens/QRScanScreen';
import TableOrderScreen from './src/screens/TableOrderScreen';

type Screen = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'home' 
  | 'menu' 
  | 'cart' 
  | 'checkout' 
  | 'orderStatus' 
  | 'market' 
  | 'profile'
  | 'qrScan'
  | 'tableOrder';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>(isAuthenticated ? 'home' : 'landing');

  // FIX: Create a navigation helper function
  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const renderScreen = () => {
    // Show landing if not authenticated
    if (!isAuthenticated) {
      switch (currentScreen) {
        case 'landing':
          return <LandingScreen onNavigate={navigateToScreen} />;
        case 'login':
          return <LoginScreen onNavigate={navigateToScreen} />;
        case 'register':
          return <RegisterScreen onNavigate={navigateToScreen} />;
        default:
          return <LandingScreen onNavigate={navigateToScreen} />;
      }
    }

    // Authenticated screens
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateToScreen} />;
      case 'menu':
        return <MenuScreen />;
      case 'cart':
        return <CartScreen onNavigate={navigateToScreen} />;
      case 'checkout':
        return <CheckoutScreen onNavigate={navigateToScreen} />;
      case 'orderStatus':
        return <OrderStatusScreen onNavigate={navigateToScreen} />;
      case 'market':
        return <MarketScreen />;
      case 'profile':
        return <ProfileScreen onNavigate={navigateToScreen} />;
      case 'qrScan':
        return <QRScanScreen onNavigate={navigateToScreen} />;
      case 'tableOrder':
        return <TableOrderScreen onNavigate={navigateToScreen} />;
      default:
        return <HomeScreen onNavigate={navigateToScreen} />;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Add a loading spinner here */}
      </View>
    );
  }

  const showTabBar = isAuthenticated && 
                     currentScreen !== 'checkout' && 
                     currentScreen !== 'orderStatus' &&
                     currentScreen !== 'landing' &&
                     currentScreen !== 'login' &&
                     currentScreen !== 'register' &&
                     currentScreen !== 'qrScan' &&
                     currentScreen !== 'tableOrder';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {showTabBar && (
        <TabBar 
          activeTab={currentScreen} 
          onTabChange={navigateToScreen}
        />
      )}
      
      <Toast />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
