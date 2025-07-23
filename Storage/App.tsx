// App.tsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [subscriptionId, setSubscriptionId] = React.useState<string | null>(
    null,
  );

  const checkSubscription = async () => {
    const isSubscribed =
      await OneSignal.User.pushSubscription.getOptedInAsync();
    console.log('Push Subscription State:', isSubscribed);

    const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
    console.log('Subscription ID:', subscriptionId);
  };

  const setupPushNotifications = async () => {
    try {
      // Get the Push Subscription ID (Player ID)
      const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
      if (!subscriptionId) {
        throw new Error('Could not get Push Subscription ID');
      }
      console.log('Push Subscription ID:', subscriptionId);
      
      // Register with your backend using the correct ID
      const response = await axios.post(
        'http://192.168.50.34:3000/noti/sendNoti',
        // Send the correct ID to the backend.
        // You can keep the key as 'onesignal_id' if your backend expects that.
        { onesignal_id: subscriptionId }, 
        { headers: { 'Content-Type': 'application/json' } },
      );
      
      const { externalId } = response.data;
      console.log('External ID:', externalId);

      // Optional: Set external ID in OneSignal
      // This links the OneSignal user to your own user database ID
      if (externalId) {
        await OneSignal.login(externalId);
      }
    } catch (error) {
      console.table('Push notification setup error:', error);
      if (error instanceof Error) {
        Alert.alert(
          'Notification Error',
          'We might not be able to send you notifications.',
        );
      }
    }
  };

  useEffect(() => {
    // Initialize OneSignal first
    checkSubscription();
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('a8739f4c-e910-4903-a466-d32c44a7ede8');

    // Set up notification listeners
    // OneSignal.Notifications.addEventListener('permissionChange', event=> {
    //   console.log('Permission changed:', event.hasPermission);
    //   if (event.hasPermission) {
    //     setupPushNotifications();
    //   }
    // });

    // // Request permission (shows native prompt)
    // OneSignal.Notifications.requestPermission(true).then(response => {
    //   if (response) {
    //     setupPushNotifications();
    //   }
    // });


    setupPushNotifications();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
