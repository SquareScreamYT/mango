// Screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>
      <Text style={{color:'#888', marginTop:40}}>App Version 1.0.0</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:24 },
  header: { fontSize:22, fontWeight:'bold', marginBottom:18 },
  settingRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:18 },
  label: { fontSize:16 },
});
