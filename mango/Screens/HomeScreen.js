import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from "../firebaseConfig";
import { app } from "../firebaseConfig";
import { getFirestore, doc, onSnapshot, getDoc, collection, getDocs, query, where } from "firebase/firestore";


const db = getFirestore(app);


export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState({ name: '', level: '' });
  // Add these lines:
const [activeBookings, setActiveBookings] = useState(0);
const [equipmentLoaned, setEquipmentLoaned] = useState(0);
const [bookings, setBookings] = useState([]);
const [announcements, setAnnouncements] = useState([]);
 useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  // Listener for user profile
  const userUnsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      setUserData({ name: user.displayName || '', level: '' });
    }
  });

  // Listener for bookings
  const bookingsUnsub = onSnapshot(collection(db, "bookings"), (snapshot) => {
    const userBookings = [];
    snapshot.forEach((doc) => {
      const date = doc.id;
      const data = doc.data();
      const slots = data.slots || {};
      Object.entries(slots).forEach(([time, slotData]) => {
        if (slotData && slotData.userId === user.uid) {
          userBookings.push({
            title: "Gym Slot",
            time,
            date
          });
        }
      });
    });
    setBookings(userBookings);
    setActiveBookings(userBookings.length);
  });

  // Listener for loans
  const loansUnsub = onSnapshot(
    query(collection(db, "loans"), where("userId", "==", user.uid), where("returned", "==", false)),
    (loanSnap) => {
      setEquipmentLoaned(loanSnap.size);
    }
  );

  // Listener for announcements
  const announcementsUnsub = onSnapshot(collection(db, "announcements"), (annSnap) => {
    const annList = annSnap.docs.map(doc => doc.data());
    setAnnouncements(annList);
  });

  // Cleanup listeners on unmount
  return () => {
    userUnsub();
    bookingsUnsub();
    loansUnsub();
    announcementsUnsub();
  };
}, []);



  // ...existing code...
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Hello, {userData.name}</Text>
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
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
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
  // Add more styles as needed for your UI
});