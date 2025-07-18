// Screens/BookingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

const slots = [
  { id: '1', time: '10:00 – 11:00' },
  { id: '2', time: '12:00 – 13:00' },
  { id: '3', time: '13:00 – 14:00' },
  { id: '4', time: '14:00 – 15:00' },
];

export default function BookingScreen() {
  const [selected, setSelected] = useState(null);

  function handleBook(slot) {
    Alert.alert('Booked!', `You booked ${slot.time} on ${selected}`, [{ text: 'Ok' }]);
    // You’d post to backend here
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
