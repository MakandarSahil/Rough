// App.tsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const waitUntilSubscribed = async () => {
    let isSubscribed = false;
    let retries = 0;

    while (!isSubscribed && retries < 5) {
      const sub = await OneSignal.User.pushSubscription.getOptedInAsync();
      isSubscribed = sub?.isSubscribed ?? false;
      console.log('Push Subscription State:', isSubscribed);

      if (!isSubscribed) {
        await new Promise(res => setTimeout(res, 2000)); // wait 2 seconds
        retries++;
      }
    }

    if (!isSubscribed) {
      throw new Error('Device never subscribed. Cannot send notification.');
    }
  };

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('a8739f4c-e910-4903-a466-d32c44a7ede8');
    OneSignal.Notifications.requestPermission(true);
    waitUntilSubscribed();

    const setupPushNotifications = async () => {
      try {
        // Get OneSignal ID
        const onesignalId = await OneSignal.User.getOnesignalId();
        if (!onesignalId) {
          throw new Error('Could not get OneSignal ID');
        }
        console.log('OneSignal ID:', onesignalId);

        // Register with your backend
        const response = await axios.post(
          'http://192.168.50.34:3000/noti/sendNoti',
          { onesignal_id: onesignalId },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const { externalId } = response.data;
        console.log('External ID:', externalId);

        // Optional: Set external ID in OneSignal
        await OneSignal.login(externalId);
      } catch (error) {
        console.error('Push notification setup error:', error);
        // Only show alert for critical errors
        if (error instanceof Error) {
          Alert.alert(
            'Notification Error',
            'We might not be able to send you notifications',
          );
        }
      }
    };

    setupPushNotifications();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}