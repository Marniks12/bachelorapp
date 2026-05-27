import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { AuthUser, login as loginRequest, signup as signupRequest } from '../api/authApi';
import { getToken, removeToken, saveToken } from '../utils/authStorage';

const AUTH_USER_KEY = 'sonaris.authUser';

let cachedAuthToken: string | null = null;

type StoredAuth = {
  token: string | null;
  user: AuthUser | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

async function getStoredAuth(): Promise<StoredAuth> {
  const [token, userJson] = await Promise.all([getToken(), getStoredUser()]);

  if (!token || !userJson) {
    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(userJson) as AuthUser;

    return { token, user };
  } catch {
    await clearStoredAuth();
    return { token: null, user: null };
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (cachedAuthToken) {
    return cachedAuthToken;
  }

  cachedAuthToken = await getToken();
  return cachedAuthToken;
}

async function saveStoredAuth(token: string, user: AuthUser): Promise<void> {
  cachedAuthToken = token;

  await Promise.all([saveToken(token), saveStoredUser(user)]);
}

export async function clearStoredAuth(): Promise<void> {
  cachedAuthToken = null;

  await Promise.all([removeToken(), removeStoredUser()]);
}

function canUseLocalStorage(): boolean {
  return Platform.OS === 'web' && typeof window !== 'undefined' && Boolean(window.localStorage);
}

async function getStoredUser(): Promise<string | null> {
  if (canUseLocalStorage()) {
    return window.localStorage.getItem(AUTH_USER_KEY);
  }

  return AsyncStorage.getItem(AUTH_USER_KEY);
}

async function saveStoredUser(user: AuthUser): Promise<void> {
  const userJson = JSON.stringify(user);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(AUTH_USER_KEY, userJson);
    return;
  }

  await AsyncStorage.setItem(AUTH_USER_KEY, userJson);
}

async function removeStoredUser(): Promise<void> {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(AUTH_USER_KEY);
    return;
  }

  await AsyncStorage.removeItem(AUTH_USER_KEY);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getStoredAuth()
      .then((storedAuth) => {
        if (isMounted) {
          cachedAuthToken = storedAuth.token;
          setToken(storedAuth.token);
          setUser(storedAuth.user);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = await loginRequest({ email, password });
    await saveStoredAuth(auth.token, auth.user);
    setToken(auth.token);
    setUser(auth.user);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const auth = await signupRequest({ name, email, password });
    await saveStoredAuth(auth.token, auth.user);
    setToken(auth.token);
    setUser(auth.user);
  }, []);

  const logout = useCallback(async () => {
    await clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(token && user);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isLoading: loading,
      isAuthenticated,
      login,
      signup,
      logout,
    }),
    [isAuthenticated, loading, login, logout, signup, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
