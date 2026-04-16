import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@gym_app_token";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://13.233.7.127:3000", // ✅ fallback (important)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR response:", error?.response);
    console.log("API ERROR data:", error?.response?.data);
    console.log("API ERROR message:", error?.message);
    console.log("API ERROR code:", error?.code);
    console.log("API ERROR request:", error?.request);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);
