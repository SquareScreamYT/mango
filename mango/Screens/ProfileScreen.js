import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { app, auth, db } from "../firebaseConfig";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    level: '', 
    role: 'user',
    profilePicture: null 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              name: data.name || '',
              email: data.email || user.email,
              level: data.level || '',
              role: data.role || 'user',
              profilePicture: data.profilePicture || null
            });
          } else {
            // If no document exists, create one with basic info
            setUserData({ 
              name: user.displayName || 'Unknown User', 
              email: user.email, 
              level: '', 
              role: 'user',
              profilePicture: null
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to load profile data');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleAdminSettings = () => {
    navigation.navigate('AdminSettings');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const defaultAvatar = 'https://i.postimg.cc/zXyz8Rg7/blank-profile-picture-973460-960-720.webp';
  const profileImageSource = userData.profilePicture 
    ? { uri: userData.profilePicture } 
    : { uri: defaultAvatar };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={profileImageSource}
        />
      </View>
      
      <Text style={styles.name}>{userData.name || 'Unknown User'}</Text>
      
      <View style={styles.emailContainer}>
        <Text style={styles.email}>{userData.email}</Text>
        {userData.role === 'admin' && (
          <Text style={styles.adminBadge}>ADMIN</Text>
        )}
      </View>

      <View style={styles.membershipSection}>
        <Text style={styles.membershipTitle}>Membership</Text>
        <Text style={styles.membershipLevel}>
          {userData.level ? userData.level.replace('sec', 'Sec ') + ' Student' : 'Student'}
        </Text>
        {userData.role === 'admin' && (
          <Text style={styles.roleBadge}>Administrator</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.navButtonText}>View History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Admin-only button */}
      {userData.role === 'admin' && (
        <TouchableOpacity 
          style={[styles.navButton, styles.adminButton]} 
          onPress={handleAdminSettings}
        >
          <Text style={styles.navButtonText}>Admin Settings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#fff' 
  },
  centered: {
    justifyContent: 'center'
  },
  avatarContainer: {
    marginBottom: 16
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50,
  },
  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 4,
    textAlign: 'center'
  },
  emailContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  email: { 
    fontSize: 16, 
    color: 'gray' 
  },
  adminBadge: { 
    fontSize: 12, 
    color: '#d32f2f', 
    fontWeight: 'bold', 
    marginLeft: 8,
    backgroundColor: '#ffebee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  membershipSection: { 
    marginVertical: 16, 
    alignItems: 'center' 
  },
  membershipTitle: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginBottom: 4 
  },
  membershipLevel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  roleBadge: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 4
  },
  buttonsContainer: { 
    flexDirection: 'row', 
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  navButton: { 
    backgroundColor: '#388CFB', 
    padding: 12, 
    borderRadius: 8, 
    marginHorizontal: 8,
    marginVertical: 4,
    minWidth: 120,
    alignItems: 'center'
  },
  adminButton: {
    backgroundColor: '#d32f2f',
    marginTop: 12,
    width: '80%'
  },
  navButtonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    textAlign: 'center'
  }
});