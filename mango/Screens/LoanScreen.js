// Screens/LoanScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const equipment = [
  { id: '1', name: 'Basketball', available: 2 },
  { id: '2', name: 'Volleyball', available: 4 },
  { id: '3', name: 'Tennis Racket', available: 5 },
  { id: '4', name: 'Shuttlecocks', available: 9 },
  { id: '5', name: 'Football', available: 2 },
];

export default function LoanScreen() {
  const [search, setSearch] = useState('');
  const filtered = equipment.filter(eq => eq.name.toLowerCase().includes(search.toLowerCase()));

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
