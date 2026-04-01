import { GYMS } from "@/data/gyms";
import { fetchGyms, GymFilters } from "@/services/gymApi";
import { useQuery } from "@tanstack/react-query";

export const GYM_QUERY_KEY = "gyms";

export function useGyms(filters: GymFilters = {}) {
  return useQuery({
    queryKey: [GYM_QUERY_KEY, filters],
    // queryFn: () => fetchGyms(filters),
    queryFn: () => {
      return GYMS;
    },
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}
