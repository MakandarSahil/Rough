// App.tsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(()=>{
    
  }, [])
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}