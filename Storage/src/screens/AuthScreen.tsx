import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loginUser } from '../features/auth/authSlice';

export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (mode === 'signup' && (!fullName || !email || !password)) {
      Alert.alert('Please fill all fields');
      return;
    }
    if (mode === 'login' && (!email || !password)) {
      Alert.alert('Please enter email and password');
      return;
    }

    if (mode === 'signup') {
      Alert.alert('Success', 'Account created (mock)');
      setMode('login');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </Text>

      {mode === 'signup' && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#94A3B8"
          value={fullName}
          onChangeText={setFullName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setMode(prev => (prev === 'login' ? 'signup' : 'login'))}
        style={{ marginTop: 16 }}
      >
        <Text style={styles.link}>
          {mode === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <Text style={styles.linkBold}>
            {mode === 'login' ? 'Sign up' : 'Login'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E293B',
    color: 'white',
    padding: 14,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
  },
  linkBold: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});
