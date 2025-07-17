import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, List } from 'react-native-paper';
import { ThemeContext } from '../ThemeContext'; 
export default function SettingsScreen() {
  const { isDark, setIsDark } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <List.Item
        title="Dark Mode"
        left={props => <List.Icon {...props} icon="theme-light-dark" color="#2196F3" />}
        right={() => (
          <Switch
            value={isDark}
            onValueChange={() => setIsDark(!isDark)}
            color="#2196F3"
          />
        )}
        style={styles.listItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  listItem: { marginVertical: 8 },
});
