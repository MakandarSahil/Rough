// src/services/tokenService.ts
import * as Keychain from 'react-native-keychain';

const ACCESS_TOKEN_SERVICE = 'com.your.app.access_token';
const REFRESH_TOKEN_SERVICE = 'com.your.app.refresh_token';
const EXTERNAL_ID_SERVICE = 'com.your.app.external_id';

interface AuthTokens {
  access_token: string | null;
  refresh_token: string | null;
}

const getCurrentTime = () => {
  const now = new Date();
  return now.toISOString();
};

export const TokenService = {
  async setExternalId(externalId: string): Promise<void> {
    try {
      await Keychain.setGenericPassword('external_id', externalId, {
        service: EXTERNAL_ID_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.error(`[${getCurrentTime()}] Failed to store tokens:`, error);
      throw error;
    }
  },

  async clearExternalId(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: EXTERNAL_ID_SERVICE });
    } catch (error) {
      console.error('Error clearing external ID from secure storage:', error);
    }
  },

  async getExternalId(): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({
        service: EXTERNAL_ID_SERVICE,
      });
      return result && typeof result !== 'boolean' ? result.password : null;
    } catch (error) {
      console.error(`[${getCurrentTime()}] Failed to retrieve tokens:`, error);
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      const timestamp = getCurrentTime();
      console.log(`[${timestamp}] Storing tokens:`);
      console.log(`Access Token: ${accessToken.substring(0, 10)}...`);
      console.log(`Refresh Token: ${refreshToken.substring(0, 10)}...`);

      await Keychain.setGenericPassword('access_token', accessToken, {
        service: ACCESS_TOKEN_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      await Keychain.setGenericPassword('refresh_token', refreshToken, {
        service: REFRESH_TOKEN_SERVICE,
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });

      console.log(`[${getCurrentTime()}] Tokens stored successfully`);
    } catch (error) {
      console.error(`[${getCurrentTime()}] Failed to store tokens:`, error);
      throw error;
    }
  },

  async getTokens(): Promise<AuthTokens> {
    try {
      console.log(`[${getCurrentTime()}] Retrieving tokens...`);

      const accessResult = await Keychain.getGenericPassword({
        service: ACCESS_TOKEN_SERVICE,
      });
      const refreshResult = await Keychain.getGenericPassword({
        service: REFRESH_TOKEN_SERVICE,
      });

      const accessToken =
        accessResult && typeof accessResult !== 'boolean'
          ? accessResult.password
          : null;
      const refreshToken =
        refreshResult && typeof refreshResult !== 'boolean'
          ? refreshResult.password
          : null;

      console.log(`[${getCurrentTime()}] Retrieved tokens:`);
      console.log(
        `Access Token: ${
          accessToken ? accessToken.substring(0, 10) + '...' : 'null'
        }`,
      );
      console.log(
        `Refresh Token: ${
          refreshToken ? refreshToken.substring(0, 10) + '...' : 'null'
        }`,
      );

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      console.error(`[${getCurrentTime()}] Failed to retrieve tokens:`, error);
      return {
        access_token: null,
        refresh_token: null,
      };
    }
  },

  async clearTokens(): Promise<void> {
    try {
      console.log(`[${getCurrentTime()}] Clearing tokens...`);

      // Get tokens before clearing to log them
      const { access_token, refresh_token } = await this.getTokens();

      await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_SERVICE });
      await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_SERVICE });

      console.log(`[${getCurrentTime()}] Tokens cleared:`);
      console.log(
        `Access Token: ${
          access_token ? access_token.substring(0, 10) + '...' : 'null'
        }`,
      );
      console.log(
        `Refresh Token: ${
          refresh_token ? refresh_token.substring(0, 10) + '...' : 'null'
        }`,
      );
    } catch (error) {
      console.error(`[${getCurrentTime()}] Failed to clear tokens:`, error);
      throw error;
    }
  },
};
