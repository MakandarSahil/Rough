// src/screens/AuthScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loginUser, signupUser, clearAuthError } from '../features/auth/authSlice'; // Import clearAuthError
import { useAppSelector } from '../hooks/useAppSelector'; // Import useAppSelector
import { getToken } from '../auth/token';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth); // Get loading and error from state

  // Effect to show error alerts when 'error' state changes
  useEffect(() => {
    if (error) {
      Alert.alert('Authentication Error', error, [
        { text: 'OK', onPress: () => dispatch(clearAuthError()) } // Clear error on dismiss
      ]);
    }
    console.log(getToken());
    console.log()
  }, [error, dispatch]);

  const handleSubmit = async () => {
    if (!email || !password || (mode === 'signup' && !name)) {
      Alert.alert('Input Error', 'Please fill in all fields.');
      return;
    }

    if (loading === 'pending') { // Prevent multiple submissions
      return;
    }

    if (mode === 'signup') {
      dispatch(signupUser({ name, email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
    // Navigation is handled by AppNavigator observing isLoggedIn state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>

      {mode === 'signup' && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={loading !== 'pending'}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={loading !== 'pending'}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={loading !== 'pending'}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.button}
        disabled={loading === 'pending'}
      >
        {loading === 'pending' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setMode(mode === 'login' ? 'signup' : 'login');
          dispatch(clearAuthError()); // Clear error when switching mode
          setName('');
          setEmail('');
          setPassword('');
        }}
        style={styles.switchButton}
        disabled={loading === 'pending'}
      >
        <Text style={styles.switchText}>
          {mode === 'login'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Guest')}
        style={styles.skipBtn}
        disabled={loading === 'pending'}
      >
        <Text style={styles.skipText}>Skip →</Text>
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
  title: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1E293B',
    color: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#CBD5E1',
    textAlign: 'center',
    fontSize: 15,
  },
  skipBtn: {
    marginTop: 40,
    alignItems: 'center',
  },
  skipText: {
    color: '#60A5FA',
    fontSize: 17,
    fontWeight: 'bold',
  },
});