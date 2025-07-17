// Screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileScreen() {
  // Replace with real user data from state/auth
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
      />
      <Text style={styles.name}>John Tan</Text>
      <Text style={styles.email}>john.tan@email.com</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Membership</Text>
        <Text>Upper Sec Student</Text>
        <Text>Joined: Jan 2025</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { alignItems:'center', flex:1, backgroundColor:'#fff', paddingTop:50 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 18},
  name: { fontSize:20, fontWeight:'bold', marginBottom:3 },
  email: { color: '#888' },
  section: { marginTop: 30, alignItems:'center' },
  sectionTitle: { fontWeight:'bold', fontSize:16, marginBottom:3 },
});
