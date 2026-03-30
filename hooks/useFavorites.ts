import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GYM_QUERY_KEY } from "./useGyms";
import { fetchFavorites, GymDto, toggleFavoriteApi } from "@/services/gymApi";

export const FAVORITES_QUERY_KEY = "favorites";

export function useFavorites() {
  return useQuery({
    queryKey: [FAVORITES_QUERY_KEY],
    queryFn: fetchFavorites,
    staleTime: 1000 * 60,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gymId: string) => toggleFavoriteApi(gymId),

    onMutate: async (gymId: string) => {
      await queryClient.cancelQueries({ queryKey: [GYM_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [FAVORITES_QUERY_KEY] });

      const previousGyms = queryClient.getQueriesData<GymDto[]>({
        queryKey: [GYM_QUERY_KEY],
      });
      const previousFavorites = queryClient.getQueryData<GymDto[]>([
        FAVORITES_QUERY_KEY,
      ]);

      queryClient.setQueriesData<GymDto[]>(
        { queryKey: [GYM_QUERY_KEY] },
        (old) =>
          old?.map((g) =>
            g.id === gymId ? { ...g, isFavorited: !g.isFavorited } : g,
          ) ?? old,
      );

      queryClient.setQueryData<GymDto[]>([FAVORITES_QUERY_KEY], (old) => {
        if (!old) return old;
        const exists = old.some((g) => g.id === gymId);
        if (exists) {
          return old.filter((g) => g.id !== gymId);
        }
        const allGyms = queryClient
          .getQueriesData<GymDto[]>({ queryKey: [GYM_QUERY_KEY] })
          .flatMap(([, d]) => d ?? []);
        const gym = allGyms.find((g) => g.id === gymId);
        return gym ? [...old, { ...gym, isFavorited: true }] : old;
      });

      return { previousGyms, previousFavorites };
    },

    onError: (_err, _gymId, context) => {
      if (context?.previousGyms) {
        for (const [queryKey, data] of context.previousGyms) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData(
          [FAVORITES_QUERY_KEY],
          context.previousFavorites,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [GYM_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FAVORITES_QUERY_KEY] });
    },
  });
}
