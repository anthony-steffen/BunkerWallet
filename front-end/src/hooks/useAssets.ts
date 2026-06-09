import { useQuery } from "@tanstack/react-query";
import  api  from "@/api/api";
import type { Assets } from "@/types/Assets";

export function useAssets() {
  return useQuery<Assets[]>({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await api.get("/assets/");
      return res.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useTopAssets() {
  return useQuery({
    queryKey: ["topAssets"],
    queryFn: async () => {
      const res = await api.get("/assets/top");
      return res.data;
    },
    staleTime: 1000 * 30,
    refetchInterval: 30_000,
    retry: 1,
  });
}
