// services/profileApi.ts
import { apiClient } from "./apiClient";
import { UpdateProfileData, ProfileData } from "@/hooks/useProfile";

export const profileApi = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await apiClient.get("/profile");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<ProfileData> => {
    const response = await apiClient.patch("/profile", data);
    return response.data;
  },

  uploadProfileImage: async (imageUri: string): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);
    
    const response = await apiClient.post("/profile/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};