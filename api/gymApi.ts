import { useQuery } from "@tanstack/react-query";
import apiClient from "./axios";

export interface GymAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface GymImage {
  url: string;
  alt?: string;
}

export interface Gym {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  rating?: number;
  monthlyFee?: number;
  fees?: {
    monthly?: number;
    quarterly?: number;
    yearly?: number;
  };
  address?: GymAddress;
  location?: string;
  images?: GymImage[] | string[];
  amenities?: string[];
  timings?: string;
  contact?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface GymsResponse {
  data?: Gym[];
  gyms?: Gym[];
  results?: Gym[];
}

const GYM_KEYS = {
  all: ["gyms"] as const,
};

export function useGyms() {
  return useQuery({
    queryKey: GYM_KEYS.all,
    queryFn: async (): Promise<Gym[]> => {
      const { data } = await apiClient.get<GymsResponse | Gym[]>("/gym/all");
      if (Array.isArray(data)) return data;
      if (data && "data" in data && Array.isArray(data.data)) return data.data;
      if (data && "gyms" in data && Array.isArray(data.gyms)) return data.gyms;
      if (data && "results" in data && Array.isArray(data.results)) return data.results;
      return [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
