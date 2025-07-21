import { getFirestore, doc, onSnapshot, collection, query, where, runTransaction, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native'; 
import * as Notifications from 'expo-notifications';

const db = getFirestore(app);
const auth = getAuth();

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function LoanScreen() {
  const [search, setSearch] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [myLoans, setMyLoans] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    // Request notification permissions when component mounts
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission not granted');
      }
    };
    requestPermissions();

    const sportsEquipmentRef = doc(db, "inventory", "sportsEquipment");
    const unsubscribe = onSnapshot(sportsEquipmentRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const items = Object.entries(data).map(([key, value]) => ({
          id: key,
          name: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase()),
          available: value ?? 0,
        }));
        setEquipment(items);
      } else {
        setEquipment([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const loansRef = collection(db, "loans");
    const q = query(loansRef, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loanedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyLoans(loanedItems);
    });

    return () => unsubscribe();
  }, [user]);

  const filtered = equipment.filter(eq => eq.name.toLowerCase().includes(search.toLowerCase()));

  const showLoanNotification = async (itemName) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Equipment Loan Confirmed',
        body: 'Loaned successfully, collect by 3:00p.m. at Locker 123',
        data: { itemName },
      },
      trigger: null, // Show immediately
    });
  };

  const handleLoan = async (item) => {
    if (!user) return Alert.alert("Login required");

    const itemRef = doc(db, "inventory", "sportsEquipment");
    const loansRef = collection(db, "loans");

    try {
      await runTransaction(db, async (transaction) => {
        const itemSnap = await transaction.get(itemRef);
        const currentData = itemSnap.data();
        const currentCount = currentData[item.id];

        if (currentCount <= 0) throw new Error("Item is no longer available.");

        transaction.update(itemRef, {
          [item.id]: currentCount - 1
        });

        transaction.set(doc(loansRef), {
          userId: user.uid,
          name: item.name,
          itemId: item.id,
          due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      });

      // Show notification after successful loan
      await showLoanNotification(item.name);
      
      Alert.alert('Loan Requested', `You have loaned a ${item.name}.`);
    } catch (error) {
      console.error("Loan error:", error);
      Alert.alert("Error", error.message || "Failed to loan item.");
    }
  };

  const handleReturn = async (loan) => {
    try {
      await runTransaction(db, async (transaction) => {
        const inventoryRef = doc(db, "inventory", "sportsEquipment");
        const inventorySnap = await transaction.get(inventoryRef);
        const currentData = inventorySnap.data();
        const currentCount = currentData[loan.itemId] ?? 0;

        transaction.update(inventoryRef, {
          [loan.itemId]: currentCount + 1
        });

        transaction.delete(doc(db, "loans", loan.id));
      });

      Alert.alert("Returned", `${loan.name} has been returned.`);
    } catch (error) {
      console.error("Return error:", error);
      Alert.alert("Error", "Failed to return item.");
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date().toISOString().split("T")[0];
    return dueDate < today;
  };

  return (
  <View style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Loan Equipment</Text>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search equipment..."
      />

      <Text style={styles.subheader}>My Loans</Text>
      {myLoans.length > 0 ? (
        myLoans.map((loan, idx) => (
          <View key={idx} style={[styles.loanRowWrapper]}>
            <View style={styles.loanRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.loanName}>{loan.name}</Text>
                <Text style={[styles.loanDue, isOverdue(loan.due) && styles.overdue]}>
                  Due: {loan.due} {isOverdue(loan.due) ? '⚠️' : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.returnBtn} onPress={() => handleReturn(loan)}>
                <Text style={{ color: '#fff' }}>Return</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No current loans.</Text>
      )}

      <Text style={styles.subheader}>Available Equipment</Text>
      {filtered.map((item) => (
        <View key={item.id} style={styles.equipmentRowWrapper}>
          <View style={styles.equipmentRow}>
            <View style={styles.equipmentDetails}>
              <Text style={styles.equipmentName}>{item.name}</Text>
              <Text style={styles.equipmentAvail}>{item.available} available</Text>
            </View>
            <TouchableOpacity
              style={[styles.loanBtn, { backgroundColor: item.available ? '#388CFB' : '#ccc' }]}
              disabled={!item.available}
              onPress={() => handleLoan(item)}
            >
              <Text style={{ color: '#fff' }}>Loan</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subheader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  search: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 14 },
  equipmentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f2f6fd', borderRadius: 8, padding: 13 },
  equipmentDetails: { flex: 1 },
  equipmentName: { fontWeight: 'bold', fontSize: 16 },
  equipmentAvail: { color: 'gray', fontSize: 13 },
  loanBtn: { padding: 10, borderRadius: 8, minWidth: 60, alignItems: 'center' },
  returnBtn: { backgroundColor: 'tomato', padding: 8, borderRadius: 6 },
  loanRow: { paddingVertical: 6, flexDirection: 'row', alignItems: 'center' },
  loanName: { fontWeight: 'bold', fontSize: 15 },
  loanDue: { fontSize: 12, color: 'gray' },
  overdue: { color: 'red', fontWeight: 'bold' },
  empty: { color: 'gray', fontStyle: 'italic' },
  loanRowWrapper: { width: '100%', marginBottom: 10},
equipmentRowWrapper: { width: '100%', marginBottom: 10},
});