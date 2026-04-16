// src/services/authApi.ts
import apiClient from "./axios";

export interface RegisterPayload {
  email: string;
  name?: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: any;
}

export const registerApi = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  console.log("🔥 API CALLING:", payload);

  const response = await apiClient.post("/auth/register", payload);

  console.log("✅ API RESPONSE:", response.data);

  return response.data;
};
