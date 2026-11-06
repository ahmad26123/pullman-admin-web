import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function TripListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Trips</Text>
      {/* Trip list items fetched from api.trips.getAll() */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0F172A' },
  title: { fontSize: 22, color: '#F8FAFC', marginBottom: 15 },
});
