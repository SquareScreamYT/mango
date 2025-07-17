// Screens/HistoryScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const myLoans = [
  { name: 'Basketball', due: '2025-08-18' },
  { name: 'Shuttlecocks', due: '2025-08-20' },
];
const myBookings = [
  { session: 'Gym Session', time: '2025-08-17, 11:00-12:00' },
  { session: 'Gym Session', time: '2025-08-18, 14:00-15:00' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My History</Text>
      <Text style={styles.section}>Loans</Text>
      {myLoans.length ? myLoans.map((l, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.icon}>🏀</Text>
          <View>
            <Text style={styles.name}>{l.name}</Text>
            <Text style={styles.subtext}>Due: {l.due}</Text>
          </View>
        </View>
      )) : <Text style={styles.empty}>No loans yet.</Text>}
      <Text style={styles.section}>Bookings</Text>
      {myBookings.length ? myBookings.map((b, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.icon}>🏋️</Text>
          <View>
            <Text style={styles.name}>{b.session}</Text>
            <Text style={styles.subtext}>{b.time}</Text>
          </View>
        </View>
      )) : <Text style={styles.empty}>No bookings yet.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:20 },
  header: { fontSize:22, fontWeight:'bold', marginBottom:10 },
  section: { fontWeight:'bold', fontSize:15, marginTop:18, marginBottom:6 },
  row: { flexDirection:'row', alignItems:'center', marginBottom:7 },
  icon: { fontSize:25, marginRight:8 },
  name: { fontWeight:'bold' },
  subtext: { color:'#666', fontSize:12 },
  empty: { color: 'gray', marginVertical:4 }
});
