// src/screens/GuestScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type GuestNavProp = NativeStackNavigationProp<RootStackParamList, 'Guest'>;

export default function GuestScreen() {
  const navigation = useNavigation<GuestNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Guest Access</Text>
      <Text style={styles.text}>
        You are browsing as a guest. Limited features available.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
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
  },
  title: {
    fontSize: 22,
    color: '#38BDF8',
    fontWeight: '700',
    marginBottom: 12,
  },
  text: { color: '#CBD5E1', marginBottom: 24 },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: '600' },
});
