// services/pushNotifications/PushNotificationService.ts
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { TokenService } from '../../hooks/useToken';
import api from '../../api/api';
import { Platform } from 'react-native';

class PushNotificationService {
  private static initialized = false;

  static async initialize(oneSignalAppId: string) {
    if (this.initialized) return;

    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(oneSignalAppId);
    OneSignal.Notifications.requestPermission(true);

    this.initialized = true;
  }

  static async waitUntilSubscribed(maxRetries = 5, delayMs = 2000) {
    let retries = 0;

    while (retries < maxRetries) {
      const subscription =
        await OneSignal.User.pushSubscription.getOptedInAsync();
      if (subscription) return true;

      await new Promise(resolve => setTimeout(resolve, delayMs));
      retries++;
    }

    return false;
  }

  static async registerWithBackend() {
    try {
      const externalId = await TokenService.getExternalId();

      if (!externalId) {
        throw new Error('Could not get External ID');
      }

      const response = await api.post('/noti/sendNoti', {
        external_id: externalId,
      });

      if (!response.data.msg) {
        throw new Error('No externalId received from backend');
      }

      return true;
    } catch (error: any) {
      console.error('Push notification registration failed:', {
        error: error.response?.data || error.message,
        config: error.config,
      });
      throw error;
    }
  }

  static async setupPushNotifications(oneSignalAppId: string) {
    await this.initialize(oneSignalAppId);

    // Check current subscription state
    const isSubscribed =
      await OneSignal.User.pushSubscription.getOptedInAsync();

    if (!isSubscribed) {
      // If not subscribed, request permission
      const permission = await OneSignal.Notifications.requestPermission(true);
      if (!permission) {
        throw new Error('User declined push notification permission');
      }
    }

    const externalId = await TokenService.getExternalId();
    if (!externalId) throw new Error('No external ID found in token service');

    await OneSignal.login(externalId);
    
    // Verify subscription after login
    const subscribed = await this.waitUntilSubscribed();
    if (!subscribed) {
      throw new Error('Device not subscribed to push notifications');
    }

    console.log('Subscribed:', subscribed);

    return this.registerWithBackend();
  }
}

export default PushNotificationService;
