import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '../services/authService';

const TOKEN_KEY = 'whatson_token';
const USER_KEY = 'whatson_user';

export const saveAuth = async (token: string, user: AuthUser): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const getUser = async (): Promise<AuthUser | null> => {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearAuth = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};
