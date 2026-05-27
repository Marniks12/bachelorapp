import AsyncStorage from '@react-native-async-storage/async-storage';
export const TOKEN_KEY = 'sonaris_auth_token';
export const USER_KEY = 'sonaris_user';

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export async function saveToken(token: string): Promise<void> {
  console.log('TOKEN SAVED', token);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  const token = canUseLocalStorage() ? window.localStorage.getItem(TOKEN_KEY) : null;
  const storedToken = token ?? (await AsyncStorage.getItem(TOKEN_KEY));

  console.log('TOKEN LOADED BEFORE API CALL', storedToken);
  return storedToken;
}

export async function removeToken(): Promise<void> {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveUser(user: unknown): Promise<void> {
  const userJson = JSON.stringify(user);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(USER_KEY, userJson);
  }

  await AsyncStorage.setItem(USER_KEY, userJson);
}

export async function getUser(): Promise<string | null> {
  const userJson = canUseLocalStorage() ? window.localStorage.getItem(USER_KEY) : null;

  return userJson ?? AsyncStorage.getItem(USER_KEY);
}

export async function removeUser(): Promise<void> {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(USER_KEY);
  }

  await AsyncStorage.removeItem(USER_KEY);
}
