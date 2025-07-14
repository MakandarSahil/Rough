// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logoutUser } from '../features/auth/authSlice';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome, {user?.name}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => dispatch(logoutUser())}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
  },
  title: { fontSize: 24, color: '#FFF', fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  label: { color: '#94A3B8', fontSize: 16, marginBottom: 6 },
  value: { color: '#FFF', fontSize: 18, fontWeight: '500' },
  logoutBtn: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
