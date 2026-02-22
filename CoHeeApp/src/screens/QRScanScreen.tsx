import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRScanner from '../components/QRScanner';
import { useApp } from '../contexts/AppContext';

interface QRScanScreenProps {
  onNavigate: (screen: string) => void;
}

export default function QRScanScreen({ onNavigate }: QRScanScreenProps) {
  const { startTableSession, showToast } = useApp();

  const handleQRScanned = async (qrData: string) => {
    try {
      console.log('QR Code scanned:', qrData);

      // Parse QR code data
      // Expected format: coheeapp://table/{location_id}/{table_number}
      // Or: table-{table_id}-{token}
      
      let tableInfo: { tableId?: string; tableNumber?: string; token?: string } = {};

      if (qrData.includes('coheeapp://table/')) {
        // Deep link format
        const parts = qrData.replace('coheeapp://table/', '').split('/');
        tableInfo = {
          tableNumber: parts[1],
          token: parts[2] || '',
        };
      } else if (qrData.includes('table-')) {
        // Simple format: table-{id}-{token}
        const parts = qrData.split('-');
        tableInfo = {
          tableId: parts[1],
          token: parts[2] || '',
        };
      }

      // Start table session
      const session = await startTableSession(tableInfo);

      if (session) {
        showToast(`Seated at Table ${session.tableNumber}`, 'success');
        // Navigate to table order screen
        onNavigate('tableOrder');
      } else {
        showToast('Failed to start table session', 'error');
        onNavigate('home');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      showToast('Invalid QR code. Please try again.', 'error');
      onNavigate('home');
    }
  };

  const handleClose = () => {
    onNavigate('home');
  };

  return (
    <View style={styles.container}>
      <QRScanner onScan={handleQRScanned} onClose={handleClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
