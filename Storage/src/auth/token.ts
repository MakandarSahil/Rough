import EncryptedStorage from 'react-native-encrypted-storage';

export const saveToken = async (token: string) => {
  await EncryptedStorage.setItem('access_token', token);
};

export const getToken = async (): Promise<string | null> => {
  return await EncryptedStorage.getItem('access_token');
};

export const removeToken = async () => {
  await EncryptedStorage.removeItem('access_token');
};
