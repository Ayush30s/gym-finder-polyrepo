import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterData, useAuth } from "@/context/AuthContext";
import { registerApi } from "@/services/authApi";

const AUTH_TOKEN_KEY = "@gym_app_token";
const AUTH_USER_KEY = "@gym_app_user";

export function useRegister() {
  const { _setSession } = useAuth();

  return useMutation({
    mutationFn: (payload: RegisterData) => registerApi(payload),

    onSuccess: async (data) => {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, data.accessToken),
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user)),
      ]);
      _setSession(data.accessToken, data.user);
    },
  });
}
