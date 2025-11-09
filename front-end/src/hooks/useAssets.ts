import { useQuery } from "@tanstack/react-query";
import  api  from "@/api/api";

export function useTopAssets() {
  return useQuery({
    queryKey: ["topAssets"],
    queryFn: async () => {
      const res = await api.get("/assets/top");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
}
