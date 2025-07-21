import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, TextInput, Modal, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, setDoc, onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import { addDoc, serverTimestamp } from 'firebase/firestore';

const db = getFirestore(app);

export default function AdminSettingsScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'slots'
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');
  const [slotToEdit, setSlotToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Check if current user is admin
    const checkAdminAccess = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docSnap = await getDocs(collection(db, "users"));
          const currentUserDoc = docSnap.docs.find(doc => doc.id === user.uid);
          if (!currentUserDoc || currentUserDoc.data().role !== 'admin') {
            Alert.alert('Access Denied', 'You do not have admin privileges.');
            navigation.goBack();
            return;
          }
          loadUsers();
          loadBookingDates();
        } catch (error) {
          console.error('Error checking admin access:', error);
          navigation.goBack();
        }
      }
    };

    checkAdminAccess();
  }, []);

  // Load all dates that have bookings for calendar marking
  const loadBookingDates = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const snapshot = await getDocs(bookingsRef);
      
      const datesWithSlots = {};
      snapshot.forEach((doc) => {
        const date = doc.id;
        const data = doc.data();
        if (data.slots && Object.keys(data.slots).length > 0) {
          datesWithSlots[date] = { 
            marked: true, 
            dotColor: '#d32f2f',
            selected: selectedDate === date,
            selectedColor: selectedDate === date ? '#d32f2f' : undefined
          };
        }
      });

      // Update marked dates to include selected date
      if (selectedDate) {
        if (datesWithSlots[selectedDate]) {
          datesWithSlots[selectedDate] = {
            ...datesWithSlots[selectedDate],
            selected: true,
            selectedColor: '#d32f2f'
          };
        } else {
          datesWithSlots[selectedDate] = {
            selected: true,
            selectedColor: '#d32f2f'
          };
        }
      }
      
      setMarkedDates(datesWithSlots);
    } catch (error) {
      console.error('Error loading booking dates:', error);
    }
  };const postAnnouncement = async () => {
  if (!newTitle.trim()) {
    Alert.alert("Error", "Announcement cannot be empty");
    return;
  }
  try {
    await addDoc(collection(db, "announcements"), {
      title: newTitle,
      time: new Date().toLocaleString(),
      timestamp: serverTimestamp()
    });
    Alert.alert("Success", "Announcement posted");
    setNewTitle('');
  } catch (error) {
    console.error("Error posting announcement:", error);
    Alert.alert("Error", "Failed to post announcement");
  }
};

  // Load slots for selected date with real-time updates
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    
    const bookingRef = doc(db, "bookings", selectedDate);
    const unsubscribe = onSnapshot(bookingRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const slotsData = data.slots || {};
        
        // Get user details for booked slots
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnapshot.docs.forEach(doc => {
          usersMap[doc.id] = doc.data();
        });
        
        const slotsList = Object.entries(slotsData).map(([timeRange, value]) => {
          if (value === true) {
            return { id: timeRange, timeRange, status: "available", bookedBy: null };
          } else if (typeof value === "object" && value.userId) {
            const user = usersMap[value.userId];
            return { 
              id: timeRange, 
              timeRange, 
              status: "booked", 
              bookedBy: user ? { id: value.userId, name: user.name, email: user.email } : null 
            };
          }
          return { id: timeRange, timeRange, status: "unavailable", bookedBy: null };
        });
        
        // Sort slots by start time
        slotsList.sort((a, b) => {
          const timeA = a.timeRange.split('-')[0];
          const timeB = b.timeRange.split('-')[0];
          return timeA.localeCompare(timeB);
        });
        setSlots(slotsList);
      } else {
        setSlots([]);
      }
    });
    
    return () => unsubscribe();
  }, [selectedDate]);

  // Update marked dates when selectedDate changes
  useEffect(() => {
    loadBookingDates();
  }, [selectedDate]);

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole
      });
      Alert.alert('Success', `User role updated to ${newRole}`);
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const deleteUser = async (userId, userName) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", userId));
              Alert.alert('Success', 'User deleted successfully');
              loadUsers();
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          }
        }
      ]
    );
  };

  const validateTimeFormat = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const isValidTimeRange = (startTime, endTime) => {
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
      return false;
    }
    
    // Convert times to minutes for comparison
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes > startMinutes;
  };

  const addSlot = async () => {
    if (!selectedDate || !newSlotStartTime.trim() || !newSlotEndTime.trim()) {
      Alert.alert('Error', 'Please select a date and enter both start and end times');
      return;
    }

    if (!isValidTimeRange(newSlotStartTime, newSlotEndTime)) {
      Alert.alert('Error', 'Please enter valid times in HH:MM format (24-hour) with end time after start time');
      return;
    }

    const timeRange = `${newSlotStartTime}-${newSlotEndTime}`;

    try {
      const bookingRef = doc(db, "bookings", selectedDate);
      await updateDoc(bookingRef, {
        [`slots.${timeRange}`]: true
      }).catch(async (error) => {
        if (error.code === 'not-found') {
          // Document doesn't exist, create it
          await setDoc(bookingRef, {
            slots: { [timeRange]: true }
          });
        } else {
          throw error;
        }
      });

      setNewSlotStartTime('');
      setNewSlotEndTime('');
      setShowAddSlotModal(false);
      Alert.alert('Success', 'Slot added successfully');
      loadBookingDates(); // Refresh calendar markers
    } catch (error) {
      console.error('Error adding slot:', error);
      Alert.alert('Error', 'Failed to add slot');
    }
  };

  const deleteSlot = async (timeRange) => {
    if (!selectedDate) return;

    Alert.alert(
      'Delete Slot',
      `Are you sure you want to delete the ${timeRange} slot? This will cancel any existing bookings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const bookingRef = doc(db, "bookings", selectedDate);
              await updateDoc(bookingRef, {
                [`slots.${timeRange}`]: null
              });
              Alert.alert('Success', 'Slot deleted successfully');
            } catch (error) {
              console.error('Error deleting slot:', error);
              Alert.alert('Error', 'Failed to delete slot');
            }
          }
        }
      ]
    );
  };

  const makeSlotAvailable = async (timeRange) => {
    if (!selectedDate) return;

    Alert.alert(
      'Make Available',
      'This will cancel the existing booking. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const bookingRef = doc(db, "bookings", selectedDate);
              await updateDoc(bookingRef, {
                [`slots.${timeRange}`]: true
              });
              Alert.alert('Success', 'Slot is now available');
            } catch (error) {
              console.error('Error updating slot:', error);
              Alert.alert('Error', 'Failed to update slot');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userLevel}>
          {item.level ? item.level.replace('sec', 'Sec ') : 'No level'} • {item.role || 'user'}
        </Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.role === 'admin' ? '#ff9800' : '#4caf50' }]}
          onPress={() => toggleUserRole(item.id, item.role)}
        >
          <Text style={styles.actionButtonText}>
            {item.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteUser(item.id, item.name)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSlot = ({ item }) => (
    <View style={styles.slotItem}>
      <View style={styles.slotInfo}>
        <Text style={styles.slotTime}>{item.timeRange}</Text>
        {item.status === 'booked' && item.bookedBy && (
          <View style={styles.bookedInfo}>
            <Text style={styles.bookedByText}>Booked by: {item.bookedBy.name}</Text>
            <Text style={styles.bookedEmailText}>{item.bookedBy.email}</Text>
          </View>
        )}
        {item.status === 'available' && (
          <Text style={styles.availableText}>Available</Text>
        )}
      </View>
      <View style={styles.slotActions}>
        {item.status === 'booked' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ff9800' }]}
            onPress={() => makeSlotAvailable(item.timeRange)}
          >
            <Text style={styles.actionButtonText}>Make Available</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteSlot(item.timeRange)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Admin Settings</Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'users' && styles.activeTab]}
            onPress={() => setActiveTab('users')}
          >
            <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
              User Management
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'slots' && styles.activeTab]}
            onPress={() => setActiveTab('slots')}
          >
            <Text style={[styles.tabText, activeTab === 'slots' && styles.activeTabText]}>
              Slot Management
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'announcements' && styles.activeTab]}
            onPress={() => setActiveTab('announcements')}
          >
            <Text style={[styles.tabText, activeTab === 'announcements' && styles.activeTabText]}>
              Announcements
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'announcements' && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Post New Announcement</Text>
            <TextInput
              style={[styles.timeInput, { marginBottom: 12 }]}
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TouchableOpacity
              style={styles.addSlotButton}
              onPress={postAnnouncement}
            >
              <Text style={styles.addSlotButtonText}>Post Announcement</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'users' ? (
          /* User Management Tab */
          <>
            {users && users.length > 0 ? (
              users.map((item) => (
                <View key={item.id}>
                  {renderUser({ item })}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No users found</Text>
            )}
            
            {/* Refresh Button - Now inside ScrollView */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadUsers}
            >
              <Text style={styles.refreshButtonText}>Refresh Users</Text>
            </TouchableOpacity>
          </>
        ) : activeTab === 'slots' ? (
          /* Slot Management Tab */
          <View style={styles.slotManagement}>
            <Calendar
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              style={styles.calendar}
            />

            {selectedDate && (
              <>
                <View style={styles.dateHeader}>
                  <Text style={styles.subHeader}>Slots for {formatDate(selectedDate)}</Text>
                  <TouchableOpacity
                    style={styles.addSlotButton}
                    onPress={() => setShowAddSlotModal(true)}
                  >
                    <Text style={styles.addSlotButtonText}>+ Add Slot</Text>
                  </TouchableOpacity>
                </View>

                {slots && slots.length > 0 ? (
                  slots.map((item) => (
                    <View key={item.id}>
                      {renderSlot({ item })}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No slots for this date</Text>
                )}
              </>
            )}
          </View>
        ) : null}
      </ScrollView>

      {/* Add Slot Modal */}
      <Modal
        visible={showAddSlotModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Slot</Text>
            <Text style={styles.modalSubtitle}>Date: {selectedDate && formatDate(selectedDate)}</Text>
            
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeLabel}>Start Time</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="HH:MM"
                  value={newSlotStartTime}
                  onChangeText={setNewSlotStartTime}
                  maxLength={5}
                />
              </View>
              
              <Text style={styles.timeSeparator}>to</Text>
              
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeLabel}>End Time</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="HH:MM"
                  value={newSlotEndTime}
                  onChangeText={setNewSlotEndTime}
                  maxLength={5}
                />
              </View>
            </View>
            
            <Text style={styles.timeHint}>Use 24-hour format (e.g., 09:00, 14:30)</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddSlotModal(false);
                  setNewSlotStartTime('');
                  setNewSlotEndTime('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addSlot}
              >
                <Text style={styles.addButtonText}>Add Slot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d32f2f'
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: '#d32f2f'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  activeTabText: {
    color: '#fff'
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  userItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#388CFB'
  },
  userInfo: {
    marginBottom: 10
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  userLevel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flex: 0.48
  },
  deleteButton: {
    backgroundColor: '#f44336'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  refreshButton: {
    backgroundColor: '#388CFB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 50
  },
  slotManagement: {
    flex: 1
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden'
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  addSlotButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6
  },
  addSlotButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  slotItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  slotInfo: {
    marginBottom: 10
  },
  slotTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  bookedInfo: {
    marginTop: 5
  },
  bookedByText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500'
  },
  bookedEmailText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  availableText: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
    marginTop: 5
  },
  slotActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  slotsList: {
    maxHeight: 400
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#d32f2f'
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666'
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  timeInputGroup: {
    flex: 1
  },
  timeLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500'
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center'
  },
  timeSeparator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 15,
    marginBottom: 12,
    fontWeight: '500'
  },
  timeHint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f5f5f5'
  },
  addButton: {
    backgroundColor: '#4caf50'
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold'
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
scrollContainer: {
  flex: 1,
},
fixedButtonContainer: {
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  backgroundColor: 'transparent',
},
});