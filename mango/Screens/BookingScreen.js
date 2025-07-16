import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

export default function BookingScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gym Booking</Text>
      <Calendar
        current={'2024-10-07'}
        markedDates={{ '2024-10-07': { selected: true, selectedColor: '#2196F3' } }}
        style={styles.calendar}
      />
      <Text style={styles.subHeader}>Available Slots</Text>
      {['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM'].map((slot, idx) => (
        <Card key={idx} style={styles.slotCard}>
          <Card.Content style={styles.slotRow}>
            <Text>Gym Slot {idx + 1}{"\n"}{slot}</Text>
            <Button mode="contained" style={styles.bookButton}>Book</Button>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  calendar: { marginBottom: 16 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
  slotCard: { marginVertical: 4 },
  slotRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookButton: { backgroundColor: '#2196F3' },
});
