// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Navigation/AppNavigator';

export default function App() {
  return (
    <>
      {/* Set your desired status bar style and background color */}
      <StatusBar 
        barStyle="dark-content"  // text/icons in dark color for light backgrounds
        backgroundColor="#ffffff" // white background (Android only)
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}
