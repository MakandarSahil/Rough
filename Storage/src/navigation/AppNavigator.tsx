// src/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { ActivityIndicator, View, StyleSheet } from 'react-native'; // Import for loading screen

import { fetchUser } from '../features/auth/authSlice';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import GuestScreen from '../screens/GuestScreen';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const authLoading = useAppSelector(state => state.auth.loading); // Use auth loading state

  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    // Only fetch user if we haven't already and app is not currently fetching
    if (!initialCheckComplete && authLoading === 'idle') {
      dispatch(fetchUser()).finally(() => {
        setInitialCheckComplete(true);
      });
    }
  }, [dispatch, initialCheckComplete, authLoading]);

  // Show a full-screen loader while the initial authentication check is in progress
  if (!initialCheckComplete) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          // If logged in, only show the Home screen
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // If not logged in, allow access to Auth and Guest screens
          // Auth is the initial route here, so it will be shown first
          <>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Guest" component={GuestScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
});
