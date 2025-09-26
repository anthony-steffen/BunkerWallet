import { useQuery } from "@tanstack/react-query";
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
