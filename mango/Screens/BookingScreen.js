import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getFirestore, doc, onSnapshot, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { app, auth } from "../firebaseConfig";

const db = getFirestore(app);

export default function BookingScreen() {
  const [selected, setSelected] = useState(null);
  const [slots, setSlots] = useState([]);
  const [allYourSlots, setAllYourSlots] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  // Load all user's booked slots across all dates
  useEffect(() => {
    if (!auth.currentUser) {
      setAllYourSlots([]);
      setMarkedDates({});
      return;
    }

    const loadAllUserSlots = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const snapshot = await getDocs(bookingsRef);
        
        const userSlots = [];
        const datesWithBookings = {};
        
        snapshot.forEach((doc) => {
          const date = doc.id;
          const data = doc.data();
          const slots = data.slots || {};
          
          Object.entries(slots).forEach(([time, value]) => {
            // Fixed: Check for null explicitly before accessing properties
            if (value && typeof value === "object" && value.userId === auth.currentUser.uid) {
              userSlots.push({
                id: `${date}-${time}`,
                date: date,
                time: time,
                datetime: `${date} ${time}`
              });
              datesWithBookings[date] = { 
                marked: true, 
                dotColor: '#388CFB',
                selected: selected === date,
                selectedColor: selected === date ? '#388CFB' : undefined
              };
            }
          });
        });
        
        // Sort slots by date and time
        userSlots.sort((a, b) => {
          if (a.date !== b.date) {
            return new Date(a.date) - new Date(b.date);
          }
          return a.time.localeCompare(b.time);
        });
        
        setAllYourSlots(userSlots);
        
        // Update marked dates to include selected date
        const updatedMarkedDates = { ...datesWithBookings };
        if (selected) {
          if (updatedMarkedDates[selected]) {
            updatedMarkedDates[selected] = {
              ...updatedMarkedDates[selected],
              selected: true,
              selectedColor: '#388CFB'
            };
          } else {
            updatedMarkedDates[selected] = {
              selected: true,
              selectedColor: '#388CFB'
            };
          }
        }
        
        setMarkedDates(updatedMarkedDates);
      } catch (error) {
        console.error("Error loading user slots:", error);
      }
    };

    loadAllUserSlots();
  }, [auth.currentUser, selected]);

  // Load slots for selected date
  useEffect(() => {
    if (!selected) {
      setSlots([]);
      return;
    }
    
    const bookingRef = doc(db, "bookings", selected);
    const unsubscribe = onSnapshot(bookingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allSlots = Object.entries(data.slots || {}).map(([time, value]) => {
          if (value === true) {
            return { id: time, time, status: "available" };
          } else if (value && typeof value === "object" && value.userId) {
            // Fixed: Check for null explicitly before accessing properties
            if (auth.currentUser && value.userId === auth.currentUser.uid) {
              return { id: time, time, status: "yours" };
            }
            return { id: time, time, status: "unavailable" };
          } else {
            return { id: time, time, status: "unavailable" };
          }
        });
        setSlots(allSlots);
      } else {
        setSlots([]);
      }
    });
    
    return () => unsubscribe();
  }, [selected]);

  async function handleBook(slot) {
    if (!auth.currentUser) {
      Alert.alert('Not logged in', 'Please log in to book a slot.');
      return;
    }
    const bookingRef = doc(db, "bookings", selected);
    try {
      await updateDoc(bookingRef, {
        [`slots.${slot.time}`]: { userId: auth.currentUser.uid }
      });
      Alert.alert('Booked!', `You booked ${slot.time} on ${selected}`, [{ text: 'Ok' }]);
    } catch (e) {
      Alert.alert('Booking Failed', e.message);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>Gym Booking</Text>
      <Calendar
        onDayPress={day => setSelected(day.dateString)}
        markedDates={markedDates}
        style={styles.calendar}
      />
      
      {selected && (
        <>
          <Text style={styles.subHeader}>All Slots for {formatDate(selected)}</Text>
          <FlatList
            data={slots}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.slotRow}>
                <Text style={{fontSize:15, flex:1}}>{item.time}</Text>
                {item.status === "available" ? (
                  <TouchableOpacity 
                    style={[styles.bookBtn, {backgroundColor: '#388CFB'}]}
                    onPress={() => handleBook(item)}
                  >
                    <Text style={{color:'#fff'}}>Book</Text>
                  </TouchableOpacity>
                ) : item.status === "yours" ? (
                  <Text style={{color: '#388CFB', fontWeight: 'bold'}}>Booked by You</Text>
                ) : (
                  <Text style={{color: 'gray'}}>Unavailable</Text>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={{color:'gray', textAlign:'center'}}>No slots for this date</Text>}
            style={styles.slotsList}
            scrollEnabled={false}
            nestedScrollEnabled={false}
          />
        </>
      )}

      <Text style={styles.subHeader}>Your Booked Slots</Text>
      <FlatList
        data={allYourSlots}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.slotRow}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>{formatDate(item.date)}</Text>
              <Text style={{fontSize: 13, color: 'gray', marginTop: 2}}>{item.time}</Text>
            </View>
            <Text style={{color: '#388CFB', fontWeight: 'bold'}}>Booked</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{color:'gray', textAlign:'center'}}>No slots booked</Text>}
        style={styles.yourSlotsList}
        scrollEnabled={false}
        nestedScrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }, 
  calendar: { marginBottom: 14, borderRadius: 9, overflow: 'hidden' },
  subHeader: { fontWeight: 'bold', fontSize: 17, marginBottom: 8, marginTop: 16 },
  slotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  bookBtn: { padding: 9, borderRadius: 6 },
  slotsList: { marginBottom: 10 },
  yourSlotsList: { marginBottom: 20 },
});