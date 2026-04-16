// hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/app/(tabs)/profile";
import { useAuth } from "@/context/AuthContext";

export function useProfile() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
    enabled: !!token, // Only run query if token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
