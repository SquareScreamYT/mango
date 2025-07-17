// Screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
      />
      <Text style={styles.name}>John Tan</Text>
      <Text style={styles.email}>john.tan@email.com</Text>

      <View style={styles.membershipSection}>
        <Text style={styles.membershipTitle}>Membership</Text>
        <Text>Upper Sec Student</Text>
        <Text>Joined: Jan 2025</Text>
      </View>

      <View style={styles.buttonsContainer}>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('History')}>
          <Text style={styles.navButtonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems:'center', flex:1, backgroundColor:'#fff', paddingTop:50 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 18 },
  name: { fontSize:20, fontWeight:'bold', marginBottom:3 },
  email: { color: '#888', marginBottom: 30 },
  membershipSection: { marginTop: 20, alignItems: 'center' },
  membershipTitle: { fontWeight:'bold', fontSize:16, marginBottom:3 },
  buttonsContainer: { marginTop: 40, width: '60%' },
  navButton: {
    backgroundColor: '#388CFB',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
