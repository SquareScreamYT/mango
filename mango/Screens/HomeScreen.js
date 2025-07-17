// Screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  const activeBookings = 2;
  const equipmentLoaned = 1;
  const bookings = [
    { title: 'Gym', time: '12:00 – 13:00', date: '2025-09-02' },
    { title: 'Gym', time: '14:00 – 15:30', date: '2025-08-07' },
  ];
  const announcements = [
    { title: 'Gym Maintenance - 19/7/25', time: '2 days ago' },
    { title: 'New Equipment Available', time: '4 hours ago' },
    { title: 'Change in Gym Hours', time: '1 day ago' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Hello, John Tan</Text>
      <View style={styles.statsRow}>
        <View style={styles.statsBox}>
          <Text style={styles.statsNum}>{activeBookings}</Text>
          <Text style={styles.statsLabel}>Active Bookings</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsNum}>{equipmentLoaned}</Text>
          <Text style={styles.statsLabel}>Equipment Loaned</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, {backgroundColor: '#388CFB'}]} 
          onPress={() => navigation.navigate('Booking')}
        >
          <Text style={styles.actionText}>Book Gym</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, {backgroundColor: '#b3d1fc'}]} 
          onPress={() => navigation.navigate('Loan')}
        >
          <Text style={styles.actionTextAlt}>Loan Equipment</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Bookings</Text>
        {bookings.map((b,i) => (
          <View key={i} style={styles.bookingCard}>
            <Text style={styles.bookingTitle}>{b.title}</Text>
            <Text style={styles.bookingTime}>{b.time}</Text>
            <Text style={styles.bookingDate}>{b.date}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        {announcements.map((a, i) => (
          <View key={i} style={styles.announcementCard}>
            <Text style={styles.announcementTitle}>{a.title}</Text>
            <Text style={styles.announcementTime}>{a.time}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={styles.historyBtn}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyBtnText}>View History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  greeting: { fontSize: 24, fontWeight: 'bold', marginBottom: 14 },
  statsRow: { flexDirection: 'row', marginBottom: 18 },
  statsBox: { flex: 1, backgroundColor: '#eaf1fb', borderRadius: 9, alignItems: 'center', padding: 16, marginHorizontal: 4 },
  statsNum: { fontSize: 30, fontWeight: 'bold', color: '#388CFB' },
  statsLabel: { fontSize: 13, color: '#333', marginTop: 6 },
  actionRow: { flexDirection: 'row', marginBottom: 18 },
  actionBtn: { flex: 1, padding: 15, borderRadius: 12, marginHorizontal: 4, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  actionTextAlt: { color: '#333', fontWeight: 'bold', fontSize: 15 },
  section: { marginTop: 16 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 7 },
  bookingCard: { backgroundColor: '#f3f6fb', padding: 12, borderRadius: 8, marginBottom: 6 },
  bookingTitle: { fontWeight: '600', fontSize: 15 },
  bookingTime: { color: '#555' },
  bookingDate: { color: '#999', fontSize: 12 },
  announcementCard: { backgroundColor: '#e3ebf7', padding: 10, borderRadius: 8, marginBottom: 6 },
  announcementTitle: { fontWeight: '500' },
  announcementTime: { color: '#888', fontSize: 11 },
  historyBtn: { marginTop: 20, alignSelf: 'center', padding: 10 },
  historyBtnText: { fontWeight: 'bold', color: '#388CFB' }
});
