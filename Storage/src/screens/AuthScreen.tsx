// src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loginUser, signupUser } from '../features/auth/authSlice';

type AuthNavProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AuthNavProp>();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      if (mode === 'signup') {
        await dispatch(signupUser({ name, email, password })).unwrap();
      } else {
        await dispatch(loginUser({ email, password })).unwrap();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>

      {mode === 'signup' && (
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        <Text style={styles.toggleText}>
          {mode === 'login'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Guest')}
        style={styles.skipBottom}
      >
        <Text style={styles.skipText}>Skip →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
    justifyContent: 'center',
  },
  skipBtn: { position: 'absolute', top: 20, right: 20 },
  skipText: { color: '#38BDF8', fontWeight: '600', fontSize: 16 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E293B',
    color: 'white',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: 'white', fontWeight: '600' },
  toggleText: { textAlign: 'center', marginTop: 16, color: '#CBD5E1' },
  skipBottom: {
    marginTop: 32,
    alignItems: 'center',
  },
});
