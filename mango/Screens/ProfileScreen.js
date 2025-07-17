import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar, List, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Card */}
      <Card style={[styles.profileCard, { backgroundColor: theme.dark ? '#333' : '#000' }]}>
        <View style={styles.profileRow}>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: '#fff' }]}>John Tan</Text>
            <Text style={styles.email}>John_tan@s2024.ssts.edu.sg</Text>
          </View>
          <Avatar.Icon
            size={80}
            icon="account"
            color="#2196F3"
            style={styles.avatar}
            backgroundColor="#e3f2fd"
          />
        </View>
      </Card>

      {/* Settings Link */}
      <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
        <List.Item
          title="Settings"
          titleStyle={[styles.settingsTitle, { color: theme.colors.text }]}
          left={props => <List.Icon {...props} icon="cog-outline" color="#2196F3" />}
          onPress={() => navigation.navigate('Settings')}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  profileCard: {
    borderRadius: 20,
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    justifyContent: 'space-between',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: '#fff',
    fontSize: 14,
  },
  avatar: {
    backgroundColor: '#e3f2fd',
  },
  settingsCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  settingsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
