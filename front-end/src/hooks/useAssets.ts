import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Assets } from "@/types/Assets";

async function fetchAssets(): Promise<Assets[]> {
  const { data } = await api.get<Assets[]>("/assets");
  return data;
}

export function useAssets() {
  return useQuery<Assets[]>({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
}

export function useCreateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (asset: Partial<Assets>) => {
      const { data } = await api.post<Assets>("/assets", asset);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}