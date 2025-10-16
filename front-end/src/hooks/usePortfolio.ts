import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export interface Asset {
	color: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  current_price: number;
  value_usd: number;
  percentage: number;
  purchase_price?: number;
  performance_pct?: number;
}

export interface PortfolioSummary {
  total_balance: number;
  assets: Asset[];
}

export function usePortfolio() {
  return useQuery<PortfolioSummary>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const walletsRes = await api.get("/wallets/");
      if (!walletsRes.data?.length) throw new Error("Nenhuma carteira encontrada");
      const wallet = walletsRes.data[0];
      const res = await api.get(`/wallets/${wallet.id}/portfolio`);
      return res.data;
    },
    refetchInterval: 30_000, // atualiza a cada 30s
    staleTime: 10_000, // evita refetch desnecessário
  });
}
