import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Assets } from "@/types/Assets";
import axios from "axios";

export interface TopAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
}

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

export function useTopAssets() {
	return useQuery<TopAsset[]>({
		queryKey: ["topAssets"],
		queryFn: async () => {
			const res = await axios.get(
				"https://api.coingecko.com/api/v3/coins/markets",
				{
					params: {
						vs_currency: "usd",
						order: "market_cap_desc",
						per_page: 100,
						page: 1,
						sparkline: true,
					},
				}
			);
			return res.data;
		},
		staleTime: 1000 * 60 * 5, // 5 minutos
		refetchOnWindowFocus: false,
	});
}