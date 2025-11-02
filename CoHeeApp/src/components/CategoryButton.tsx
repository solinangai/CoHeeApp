import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

export default function CategoryButton({ name, count, isActive, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={onPress}
    >
      <Text style={[styles.text, isActive && styles.textActive]}>
        {name} ({count})
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginRight: 12,
  },
  buttonActive: {
    backgroundColor: '#2C1810',
  },
  text: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  textActive: {
    color: '#FFFFFF',
  },
});
