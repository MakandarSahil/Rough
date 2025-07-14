import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logoutUser } from '../features/auth/authSlice';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Hello, {data?.name} 👋</Text>
      <Text style={styles.subtext}>We're glad to see you again!</Text>

      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>📋 Profile Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data?.email || 'Not Provided'}</Text>
        </View>
        {/* Add more user details here */}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => dispatch(logoutUser())}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    flexGrow: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38BDF8',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: '#38BDF8',
    fontSize: 16,
  },
  errorText: {
    color: '#F87171',
    fontSize: 16,
  },
});
