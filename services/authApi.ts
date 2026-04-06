import { RegisterData, User } from "@/context/AuthContext";
import { apiClient } from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@gym_app_token";

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// 🔐 LOGIN
export async function signInApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/signin", {
      email,
      password,
    });

    // ✅ Token save
    if (data?.accessToken) {
      await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
}

// 📝 REGISTER
export async function registerApi(
  payload: RegisterData,
): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );

    // ✅ Auto login after register (optional 🔥)
    if (data?.accessToken) {
      await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
}
