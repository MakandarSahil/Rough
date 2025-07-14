// src/auth/token.ts
import EncryptedStorage from 'react-native-encrypted-storage';

export const saveToken = async (token: string) => {
  try {
    await EncryptedStorage.setItem('token', token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const getToken = async () => {
  try {
    return await EncryptedStorage.getItem('token');
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await EncryptedStorage.removeItem('token');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};
