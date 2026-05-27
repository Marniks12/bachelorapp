import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const TOKEN_KEY = 'sonaris_auth_token';

function canUseLocalStorage(): boolean {
  return Platform.OS === 'web' && typeof window !== 'undefined' && Boolean(window.localStorage);
}

export async function saveToken(token: string): Promise<void> {
  console.log('TOKEN SAVED', token);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  const token = canUseLocalStorage()
    ? window.localStorage.getItem(TOKEN_KEY)
    : await AsyncStorage.getItem(TOKEN_KEY);

  console.log('TOKEN LOADED', token);
  return token;
}

export async function removeToken(): Promise<void> {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await AsyncStorage.removeItem(TOKEN_KEY);
}
