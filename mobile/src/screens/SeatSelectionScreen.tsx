import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SeatSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Seat</Text>
      {/* Interactive Bus Seat Map */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0F172A', alignItems: 'center' },
  title: { fontSize: 22, color: '#0EA5E9', marginBottom: 20 },
});
