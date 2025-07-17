import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

export default function HistoryScreen() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <Text style={styles.subHeader}>My Loans</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text>Basketball</Text>
          <Text>Due: 2024-08-15</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Text>Volleyball</Text>
          <Text>Due: 2024-08-16</Text>
        </Card.Content>
      </Card>
      <Text style={styles.subHeader}>Gym Bookings</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text>Gym Session</Text>
          <Text>2024-08-14, 10:00 AM - 11:00 AM</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  card: { marginVertical: 4 },
});
