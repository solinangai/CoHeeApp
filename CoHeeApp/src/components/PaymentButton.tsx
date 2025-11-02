import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { PaymentMethod } from '../types';

interface Props {
  method: PaymentMethod;
  onPress: (methodId: string) => void;
  isProcessing: boolean;
  selectedMethod: string;
}

export default function PaymentButton({ method, onPress, isProcessing, selectedMethod }: Props) {
  const isSelected = selectedMethod === method.id;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: method.color }]}
      onPress={() => onPress(method.id)}
      disabled={isProcessing}
    >
      {isProcessing && isSelected ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.icon}>{method.icon}</Text>
          <Text style={styles.text}>{method.name}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
