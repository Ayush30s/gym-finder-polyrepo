// src/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerApi } from "@/services/authApi";
import { useAuth } from "../context/AuthContext";

const AUTH_TOKEN_KEY = "@gym_app_token";
const AUTH_USER_KEY = "@gym_app_user";

export function useRegister() {
  const auth = useAuth(); // ✅ SAFE

  return useMutation({
    mutationFn: registerApi,

    onSuccess: async (data) => {
      console.log("SUCCESS:", data);

      auth._setSession(data.accessToken, data.user);
    },

    onError: (error: any) => {
      console.log("❌ REGISTER ERROR:");
      console.log("Status:", error?.response?.status);
      console.log("Data:", error?.response?.data);
      console.log("Message:", error?.message);
    },
  });
}
