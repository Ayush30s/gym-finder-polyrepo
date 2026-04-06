import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { signInApi, registerApi } from "@/services/authApi";

// --- Global Types ---
export interface User {
  id?: number;
  email: string;
  name?: string;
  role?: string;
  profileImageUrl?: string;
}

// ... (AddressDto, ProfileDto, RegisterData remain same)

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  _setSession: (token: string, user: User) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>; // ✅
  signUp: (data: any) => Promise<void>; // ✅
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_TOKEN_KEY = "@gym_app_token";
const AUTH_USER_KEY = "@gym_app_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const _setSession = useCallback(async (newToken: string, newUser: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken),
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser)),
      ]);
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(AUTH_USER_KEY),
      ]);
      setToken(null);
      setUser(null);
      // Automatically redirect to signin
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await signInApi(email, password);

      await _setSession(res.accessToken, res.user);

      // ✅ redirect after login
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Login Error:", error.message);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (payload: any) => {
    try {
      const res = await registerApi(payload);

      await _setSession(res.accessToken, res.user);

      // ✅ redirect after register
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Register Error:", error.message);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        signOut,
        _setSession,
        signIn, // ✅ ADD
        signUp, // ✅ ADDF
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
