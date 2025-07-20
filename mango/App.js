import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreen';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Navigation/AppNavigator';
import { auth } from "./firebaseConfig";
import { app } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // or a splash/loading screen

  return (
  <NavigationContainer>
    {user ? <AppNavigator /> : <AuthStack />}
  </NavigationContainer>
);
}
