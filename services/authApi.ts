
import { RegisterData, User } from "@/context/AuthContext";
import { apiClient } from "./apiClient";

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export async function signInApi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/signin", {
    email,
    password,
  });
  return data;
}

export async function registerApi(payload: RegisterData): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}
