// hooks/usePushNotifications.ts
import { useEffect } from 'react';
import PushNotificationService from '../services/pushNotifications/PushNotificationService';
import { useAppSelector } from './useAppSelector';

export const usePushNotifications = (oneSignalAppId: string) => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    const setup = async () => {
      try {
        await PushNotificationService.setupPushNotifications(oneSignalAppId);
      } catch (error) {
        console.error('Push notification setup error:', error);
      }
    };

    setup();
  }, [isLoggedIn, oneSignalAppId]);
};
