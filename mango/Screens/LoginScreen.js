import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const db = getFirestore(app);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  // Sign up fields
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('sec1');
  // Role will be set to 'user' by default, admins must be set manually in Firebase

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Do nothing here! App.js will handle navigation on auth state change.
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleSignUp = async () => {
    if (!name) return Alert.alert('Missing Name', 'Please enter your name.');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      await updateProfile(userCredential.user, { displayName: name });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email: signUpEmail,
        level,
        role: 'user' // Always set to 'user' by default
      });
      setShowSignUp(false);
      setEmail(signUpEmail);
      setPassword(signUpPassword);
      Alert.alert('Sign Up Successful', 'You can now log in.');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity style={styles.signupBtn} onPress={() => setShowSignUp(true)}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <Modal
        visible={showSignUp}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSignUp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Sign Up</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            <Picker
              selectedValue={level}
              style={styles.input}
              onValueChange={setLevel}
            >
              <Picker.Item label="Sec 1" value="sec1" />
              <Picker.Item label="Sec 2" value="sec2" />
              <Picker.Item label="Sec 3" value="sec3" />
              <Picker.Item label="Sec 4" value="sec4" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={signUpEmail}
              onChangeText={setSignUpEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={signUpPassword}
              onChangeText={setSignUpPassword}
              secureTextEntry
            />
            <Button title="Create Account" onPress={handleSignUp} />
            <TouchableOpacity style={{marginTop: 10}} onPress={() => setShowSignUp(false)}>
              <Text style={{color: '#388CFB', textAlign: 'center'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  header: { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:15 },
  signupBtn: { marginTop: 18, alignSelf: 'center' },
  signupText: { color: '#388CFB', fontSize: 16 },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' },
  modalContent: { backgroundColor:'#fff', borderRadius:10, padding:20, width:'90%' },
});