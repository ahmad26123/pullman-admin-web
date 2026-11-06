import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings & Reservations</Text>
      {/* List of customer reserved/confirmed bookings */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0F172A' },
  title: { fontSize: 22, color: '#F8FAFC', marginBottom: 15 },
});
