import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import BookingScreen from '../Screens/BookingScreen';
import LoanScreen from '../Screens/LoanScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Ionicons name="home-outline" size={size} color={color} />;
          if (route.name === 'Booking') return <MaterialIcons name="event-note" size={size} color={color} />;
          if (route.name === 'Loan') return <MaterialIcons name="sports-tennis" size={size} color={color} />;
          if (route.name === 'History') return <MaterialIcons name="history" size={size} color={color} />;
          if (route.name === 'Profile') return <Ionicons name="person-outline" size={size} color={color} />;
          if (route.name === 'Settings') return <Ionicons name="settings-outline" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Loan" component={LoanScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
