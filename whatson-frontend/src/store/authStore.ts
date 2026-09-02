import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '../services/authService';

const TOKEN_KEY = 'whatson_token';
const USER_KEY = 'whatson_user';
const ONBOARDING_KEY = 'whatson_onboarding_seen';

export const saveAuth = async (token: string, user: AuthUser): Promise<void> => {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify({
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: (user as any).username || '',
        bio: (user as any).bio || '',
        website: (user as any).website || '',
        avatar: (user as any).avatar || '',
        role: (user as any).role || 'user',
      })
    ),
  ]);
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

export const hasSeenOnboarding = async (): Promise<boolean> => {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
};

export const setOnboardingSeen = async (): Promise<void> => {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
};
