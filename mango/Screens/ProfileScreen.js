import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { auth } from "../firebaseConfig";

const db = getFirestore(app);

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({ name: '', email: '', level: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData({ name: user.displayName || '', email: user.email, level: '' });
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
      />
      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.email}>{userData.email}</Text>
      <View style={styles.membershipSection}>
        <Text style={styles.membershipTitle}>Membership</Text>
        <Text>{userData.level ? userData.level.replace('sec', 'Sec ') : ''} Student</Text>
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
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, color: 'gray', marginBottom: 16 },
  membershipSection: { marginVertical: 16, alignItems: 'center' },
  membershipTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  buttonsContainer: { flexDirection: 'row', marginTop: 20 },
  navButton: { backgroundColor: '#388CFB', padding: 12, borderRadius: 8, marginHorizontal: 8 },
  navButtonText: { color: '#fff', fontWeight: 'bold' },
});