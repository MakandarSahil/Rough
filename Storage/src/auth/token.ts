import EncryptedStorage from 'react-native-encrypted-storage';

export const saveToken = async (token: string) => {
  await EncryptedStorage.setItem('token', token);
};

export const getToken = async () => {
  return await EncryptedStorage.getItem('token');
};

export const removeToken = async () => {
  await EncryptedStorage.removeItem('token');
};
