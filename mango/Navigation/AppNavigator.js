// Navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import BookingScreen from '../Screens/BookingScreen';
import LoanScreen from '../Screens/LoanScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({color, size}) => (<Icon name="home" color={color} size={size} />) }} 
      />
      <Tab.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ tabBarIcon: ({color, size}) => (<Icon name="calendar" color={color} size={size} />) }} 
      />
      <Tab.Screen 
        name="Loan" 
        component={LoanScreen}
        options={{ tabBarIcon: ({color, size}) => (<Icon name="tennis-ball" color={color} size={size} />) }}  
      />
      <Tab.Screen 
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: ({color, size}) => (<Icon name="history" color={color} size={size} />) }}  
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({color, size}) => (<Icon name="account" color={color} size={size} />) }}  
      />
      <Tab.Screen 
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({color, size}) => (<Icon name="cog" color={color} size={size} />) }}  
      />
    </Tab.Navigator>
  );
}
