import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@gym_finder_token";
const USER_KEY = "@gym_finder_user";

interface Address {
  state: string;
  city: string;
  pincode: string;
}

interface Profile {
  gender: string;
  dob: string;
  heightCm: number;
  weightKg: number;
  profileImageUrl: string;
  address: string;
  bio: string;
  contact_no: string;
}

export interface User {
  id?: string;
  email: string;
  name?: string;
  profileImageUrl?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  address?: Address;
  profile?: Profile;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user: User, token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    try {
      const [token, userJson] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
