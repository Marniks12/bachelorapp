import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthUser, login as loginRequest, signup as signupRequest } from '../api/authApi';
import { clearAuthToken, getStoredAuth, saveAuthToken, saveAuthUser } from './tokenStorage';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getStoredAuth()
      .then((storedAuth) => {
        if (isMounted) {
          setToken(storedAuth.token);
          setUser(storedAuth.user);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = await loginRequest({ email, password });
    await Promise.all([saveAuthToken(auth.token), saveAuthUser(auth.user)]);
    setToken(auth.token);
    setUser(auth.user);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const auth = await signupRequest({ name, email, password });
    await Promise.all([saveAuthToken(auth.token), saveAuthUser(auth.user)]);
    setToken(auth.token);
    setUser(auth.user);
  }, []);

  const logout = useCallback(async () => {
    await clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      signup,
      logout,
    }),
    [isLoading, login, logout, signup, token, user],
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
