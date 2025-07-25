// App.tsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { usePushNotifications } from './src/hooks/usePushNotifications';

import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

const ONE_SIGNAL_APP_ID = 'a8739f4c-e910-4903-a466-d32c44a7ede8';

function AppWrapper() {
  useEffect(() => {
    // Initialize OneSignal
    OneSignal.initialize(ONE_SIGNAL_APP_ID);
    
    // Set the requires user privacy consent flag if needed
    OneSignal.Notifications.canRequestPermission().then(canRequest => {
      if (canRequest) {
        OneSignal.Notifications.requestPermission(true);
      }
    });

    // Add subscription observer
    OneSignal.Notifications.addEventListener('permissionChange', (state) => {
      console.log('Subscription state changed:', state);
    });
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  usePushNotifications(ONE_SIGNAL_APP_ID);

  return <AppNavigator />;
}

export default AppWrapper;
