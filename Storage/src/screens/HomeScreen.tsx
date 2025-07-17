import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logoutUser } from '../features/auth/authSlice';
import { getUserApi } from '../api/authApi';

export default function HomeScreen() {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserApi();
        console.log('Fetched user in HomeScreen:', user.isVerified);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleCheckVerification = async () => {
    try {
      const response = await getUserApi();
      Alert.alert(
        'Verification Status',
        response.isVerified ? '✅ User is verified' : '❌ User is not verified'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch verification status');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
      {user?.email && <Text style={styles.subtitle}>Email: {user.email}</Text>}

      <TouchableOpacity
        style={styles.verifyBtn}
        onPress={handleCheckVerification}
      >
        <Text style={styles.verifyText}>Check Verification</Text>
      </TouchableOpacity>

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 30,
    textAlign: 'center',
  },
  verifyBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
