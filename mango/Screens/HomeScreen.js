import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme(); 
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Hello, John Tan</Text>
        <IconButton
          icon="cog-outline"
          size={28}
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <View style={styles.row}>
        <Card style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
          <Card.Content>
            <Text style={styles.statText}>2{"\n"}Active Bookings</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
          <Card.Content>
            <Text style={styles.statText}>1{"\n"}Equipment Loaned</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.row}>
        <Button mode="contained" style={styles.actionButton}>Book Gym</Button>
        <Button mode="contained" style={styles.actionButton}>Loan Equipment</Button>
      </View>

      <Card style={styles.section}>
        <Card.Title title="Current Bookings" />
        <Card.Content>
          <View style={styles.bookingItem}>
            <Text style={{ color: theme.colors.text }}>Gym{"\n"}12.00am - 1.00pm</Text>
            <Text style={{ color: theme.colors.text }}>9/2/25</Text>
          </View>
          <View style={styles.bookingItem}>
            <Text style={{ color: theme.colors.text }}>Gym{"\n"}2.00pm - 3.30pm</Text>
            <Text style={{ color: theme.colors.text }}>8/7/25</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Title title="Announcements" />
        <Card.Content>
          <Text style={{ color: theme.colors.text }}>Gym Maintenance - 19/7/25{"\n"}2 days ago</Text>
          <Text style={{ color: theme.colors.text }}>New Equipment Available{"\n"}4 hours ago</Text>
          <Text style={{ color: theme.colors.text }}>Change in Gym Hours{"\n"}1 day ago</Text>
        </Card.Content>
      </Card>

      <Button mode="contained" style={styles.historyButton}>View History</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  settingsIcon: { marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statCard: { flex: 1, margin: 4, alignItems: 'center', justifyContent: 'center' },
  statText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  actionButton: { flex: 1, margin: 4, backgroundColor: '#2196F3' },
  section: { marginVertical: 8 },
  bookingItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  historyButton: { marginTop: 16, backgroundColor: '#2196F3' },
});
