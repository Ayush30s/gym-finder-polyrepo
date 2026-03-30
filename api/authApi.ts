import { useMutation } from "@tanstack/react-query";
import apiClient from "./axios";
import { User } from "@/store/authStore";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name?: string;
  password: string;
  profileImageUrl?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  address?: {
    state: string;
    city: string;
    pincode: string;
  };
  profile?: {
    gender: string;
    dob: string;
    heightCm: number;
    weightKg: number;
    profileImageUrl: string;
    address: string;
    bio: string;
    contact_no: string;
  };
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (payload: SignInPayload): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>("/auth/signin", payload);
      return data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
      return data;
    },
  });
}
