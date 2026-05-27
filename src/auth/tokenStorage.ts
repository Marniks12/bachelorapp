import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthUser } from '../api/authApi';

const AUTH_TOKEN_KEY = 'sonaris.authToken';
const AUTH_USER_KEY = 'sonaris.authUser';

export type StoredAuth = {
  token: string | null;
  user: AuthUser | null;
};

export async function getStoredAuth(): Promise<StoredAuth> {
  const [token, userJson] = await Promise.all([
    AsyncStorage.getItem(AUTH_TOKEN_KEY),
    AsyncStorage.getItem(AUTH_USER_KEY),
  ]);

  if (!userJson) {
    return { token, user: null };
  }

  try {
    const user = JSON.parse(userJson) as AuthUser;
    return { token, user };
  } catch {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    return { token, user: null };
  }
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function saveAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function saveAuthUser(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export async function clearAuthToken(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    AsyncStorage.removeItem(AUTH_USER_KEY),
  ]);
}
