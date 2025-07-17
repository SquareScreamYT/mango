import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Searchbar, Text, Card } from 'react-native-paper';

const equipmentList = [
  { name: 'Basketball', available: 2, },
  { name: 'Volleyball', available: 3, },
  { name: 'Tennis Rackets', available: 4, },
  { name: 'Badminton Rackets', available: 5, },
  { name: 'Football', available: 6, },
  { name: 'Shuttlecocks', available: 6, },
];

export default function LoanScreen() {
  const [search, setSearch] = useState('');
  const filtered = equipmentList.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search for equipment"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.available}>Available</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.count}>{item.available} available</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  search: { marginBottom: 12 },
  card: { marginVertical: 6, padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 60, height: 60, marginRight: 16 },
  available: { color: '#2196F3', fontWeight: 'bold' },
  name: { fontSize: 18, fontWeight: 'bold' },
  count: { color: 'gray' },
});
