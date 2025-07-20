
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../Screens/HomeScreen';
import BookingScreen from '../Screens/BookingScreen';
import LoanScreen from '../Screens/LoanScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import SettingsScreen from '../Screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <ProfileStack.Screen name="History" component={HistoryScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
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
        name="Profile"
        component={ProfileStackScreen}
        options={{ tabBarIcon: ({color, size}) => (<Icon name="account" color={color} size={size} />) }}
      />
    </Tab.Navigator>
  );
}


export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={MainTabs} />
    </RootStack.Navigator>
  );
}