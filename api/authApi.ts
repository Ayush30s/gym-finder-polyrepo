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
  return useMutation<AuthResponse, any, SignInPayload>({
    mutationFn: async (payload: SignInPayload) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/signin",
        payload,
      );
      console.log("signin response:", response.data);
      return response.data;
    },
    onError: (error: any) => {
      console.log("Sign in failed");
      console.log("Status:", error?.response?.status);
      console.log("Data:", error?.response?.data);
      console.log("Message:", error?.message);
    },
  });
}

export function useRegister() {
  return useMutation<AuthResponse, any, RegisterPayload>({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        payload,
      );
      console.log("register response:", response.data);
      return response.data;
    },
    onError: (error: any) => {
      console.log("Register failed");
      console.log("Status:", error?.response?.status);
      console.log("Data:", error?.response?.data);
      console.log("Message:", error?.message);
    },
  });
}
