// hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/services/profileApi";
import { useAuth } from "@/context/AuthContext";

export interface ProfileData {
  id: number;
  gender: string;
  dob: Date;
  heightCm: number;
  weightKg: number;
  profileImageUrl?: string;
  address: string;
  bio: string;
  contact_no: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    profileImageUrl?: string;
    address?: {
      state: string;
      city: string;
      pincode: string;
    };
  };
}

export interface UpdateProfileData {
  name?: string;
  profileImageUrl?: string;
  profile?: {
    gender?: string;
    dob?: Date;
    heightCm?: number;
    weightKg?: number;
    address?: string;
    bio?: string;
    contact_no?: string;
  };
  address?: {
    state?: string;
    city?: string;
    pincode?: string;
  };
}

export function useProfile() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getProfile(),
    enabled: !!token,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileData) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}