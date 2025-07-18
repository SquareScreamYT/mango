// Screens/LoanScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function LoanScreen() {
  const [search, setSearch] = useState('');
  const [equipment, setEquipment] = useState([]);
  const filtered = equipment.filter(eq => eq.name.toLowerCase().includes(search.toLowerCase()));
console.log('Firestore db instance:', db);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'inventory', 'sportsEquipment'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const equipmentArray = Object.keys(data).map((key, index) => ({
          id: (index + 1).toString(),
          name: key,
          available: data[key],
        }));
        setEquipment(equipmentArray);
      }
    });

    return () => unsub();
  }, []);

  
  function handleLoan(item) {
    Alert.alert('Loan Request Sent', `You have loaned a ${item.name}.`, [{ text: 'Ok' }]);
    // Here, post to backend and set up reminder notification
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loan Equipment</Text>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search equipment..."
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.equipmentRow}>
            <View style={styles.equipmentDetails}>
              <Text style={styles.equipmentName}>{item.name}</Text>
              <Text style={styles.equipmentAvail}>{item.available} available</Text>
            </View>
            <TouchableOpacity
              style={[styles.loanBtn, {backgroundColor: item.available ? '#388CFB' : '#ccc'}]}
              disabled={!item.available}
              onPress={() => handleLoan(item)}
            >
              <Text style={{color:'#fff'}}>Loan</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:20 },
  header: { fontSize:22, fontWeight:'bold', marginBottom:10 },
  search: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 14 },
  equipmentRow: { flexDirection:'row', alignItems:'center', marginBottom:12, backgroundColor:'#f2f6fd', borderRadius:8, padding:13 },
  equipmentDetails: { flex: 1 },
  equipmentName: { fontWeight:'bold', fontSize:16 },
  equipmentAvail: { color:'gray', fontSize:13 },
  loanBtn: { padding: 10, borderRadius: 8, minWidth:60, alignItems:'center' },
});
