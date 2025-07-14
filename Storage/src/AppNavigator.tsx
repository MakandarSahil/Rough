// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { fetchUser } from './features/auth/authSlice';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import GuestScreen from './screens/GuestScreen';
import { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  // Optional: to handle loading state before rendering screens
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    dispatch(fetchUser()).finally(() => setCheckingLogin(false));
  }, []);

  if (checkingLogin) return null; // You can return splash screen or loader here

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Guest" component={GuestScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
