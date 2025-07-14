import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const mockData = {
  gymSlots: [
    { id: 1, name: 'Gym Slot 1', time: '10:00 AM - 11:00 AM' },
    { id: 2, name: 'Gym Slot 2', time: '11:00 AM - 12:00 PM' },
    { id: 3, name: 'Gym Slot 3', time: '12:00 PM - 1:00 PM' },
    { id: 4, name: 'Gym Slot 4', time: '1:00 PM - 2:00 PM' },
  ],
};

const App = () => {
  const [selectedDate, setSelectedDate] = useState('2024-10-07');

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#4A90E2',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gym Booking</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            current="2024-10-01"
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: '#4A90E2',
              todayTextColor: '#4A90E2',
              arrowColor: '#4A90E2',
            }}
          />
        </View>

        <View style={styles.slotsContainer}>
          <Text style={styles.slotsTitle}>Available Slots</Text>
          
          {mockData.gymSlots.map((slot) => (
            <View key={slot.id} style={styles.slotCard}>
              <View style={styles.slotInfo}>
                <Text style={styles.slotName}>{slot.name}</Text>
                <Text style={styles.slotTime}>{slot.time}</Text>
              </View>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => Alert.alert('Success', 'Gym slot booked!')}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarContainer: {
    backgroundColor: '#E8F4FD',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  slotsContainer: {
    paddingHorizontal: 20,
  },
  slotsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  slotCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotInfo: {
    flex: 1,
  },
  slotName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  slotTime: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default App;
