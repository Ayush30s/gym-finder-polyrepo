import apiClient from "@/api/axios";



export interface GymDto {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  priceTier: "Budget" | "Mid" | "Premium";
  pricePerMonth: number;
  yearsActive: number;
  tags: string[];
  isOpen: boolean;
  distance: string;
  highlight: string;
  isFavorited: boolean;
}

export interface GymFilters {
  search?: string;
  priceTier?: string;
  minRating?: string;
  yearsCategory?: string;
}

export interface GymsResponse {
  data: GymDto[];
  total: number;
}

export interface FavoriteResponse {
  gymId: string;
  isFavorited: boolean;
}

export async function fetchGyms(filters: GymFilters = {}): Promise<GymDto[]> {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.priceTier && filters.priceTier !== "Any")
    params.priceTier = filters.priceTier;
  if (filters.minRating && filters.minRating !== "Any")
    params.minRating = filters.minRating.replace("+", "");
  if (filters.yearsCategory && filters.yearsCategory !== "Any")
    params.yearsCategory = filters.yearsCategory;

  const { data } = await apiClient.get<GymsResponse>("/gyms", { params });
  return data.data;
}

export async function fetchFavorites(): Promise<GymDto[]> {
  const { data } = await apiClient.get<GymsResponse>("/gyms/favorites");
  return data.data;
}

export async function toggleFavoriteApi(
  gymId: string,
): Promise<FavoriteResponse> {
  const { data } = await apiClient.post<FavoriteResponse>(
    `/gyms/${gymId}/favorite`,
  );
  return data;
}
