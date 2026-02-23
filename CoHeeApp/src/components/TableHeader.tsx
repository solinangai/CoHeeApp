import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TableHeaderProps {
  tableNumber: string;
  sessionStartTime: Date;
  onEndSession: () => void;
}

export default function TableHeader({
  tableNumber,
  sessionStartTime,
  onEndSession,
}: TableHeaderProps) {
  const [elapsed, setElapsed] = useState<string>('0:00');

  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - sessionStartTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsed(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.tableInfo}>
          <Text style={styles.label}>Table</Text>
          <Text style={styles.tableNumber}>{tableNumber}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.timeInfo}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.time}>{elapsed}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.endButton} onPress={onEndSession}>
        <Text style={styles.endButtonText}>End</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6F4E37',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableInfo: {
    marginRight: 16,
  },
  timeInfo: {
    marginLeft: 16,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  tableNumber: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  time: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  endButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  endButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
