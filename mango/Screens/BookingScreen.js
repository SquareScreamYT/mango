// Screens/BookingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig"; // adjust path if needed

const db = getFirestore(app);

export default function BookingScreen() {
  const [selected, setSelected] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!selected) {
      setSlots([]);
      return;
    }
    const bookingRef = doc(db, "bookings", selected);
    const unsubscribe = onSnapshot(bookingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Only show slots that are available (true)
        const availableSlots = Object.entries(data.slots || {})
          .filter(([_, available]) => available)
          .map(([time], idx) => ({
            id: time,
            time,
          }));
        setSlots(availableSlots);
      } else {
        setSlots([]); // No slots for this date
      }
    });
    return () => unsubscribe();
  }, [selected]);

  function handleBook(slot) {
    Alert.alert('Booked!', `You booked ${slot.time} on ${selected}`, [{ text: 'Ok' }]);
    // Add Firestore update logic here if you want to mark as booked
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gym Booking</Text>
      <Calendar
        onDayPress={day => setSelected(day.dateString)}
        markedDates={selected ? { [selected]: { selected: true, selectedColor: '#388CFB' } } : {}}
        style={styles.calendar}
      />
      <Text style={styles.subHeader}>Available Slots</Text>
      <FlatList
        data={slots}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.slotRow}>
            <Text style={{fontSize:15, flex:1}}>{item.time}</Text>
            <TouchableOpacity 
              style={[styles.bookBtn, {backgroundColor: selected ? '#388CFB' : '#ccc'}]}
              disabled={!selected}
              onPress={() => handleBook(item)}
            >
              <Text style={{color:'#fff'}}>Book</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{color:'gray', textAlign:'center'}}>No available slots</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#fff', padding:20 },
  header: { fontSize:22, fontWeight:'bold', marginBottom:10 }, 
  calendar: { marginBottom: 14, borderRadius:9, overflow:'hidden'},
  subHeader: { fontWeight: 'bold', fontSize: 17, marginBottom: 8 },
  slotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  bookBtn: { padding: 9, borderRadius: 6 },
});