import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export interface Asset {
  name: string;
  symbol: string;
  color?: string;
  image?: string;
  quantity: number;
  current_price: number;
  purchase_price?: number | null;
  value_usd: number;
  performance_pct?: number | null;
  price_24h_ago?: number | null;
  change_24h_usd?: number | null;
  performance_pct_24h?: number | null;
  last_price_update?: string | null;
  percentage: number;
}

export interface PortfolioSummary {
  total_balance: number;
  assets: Asset[];
}

interface WalletRecord {
  id: number;
}

export function usePortfolio(walletId?: number) {
  return useQuery<PortfolioSummary>({
    queryKey: ["portfolio", walletId],
    queryFn: async () => {
      const walletsRes = await api.get<WalletRecord[]>("/wallets/");

      if (!walletsRes.data?.length) {
        throw new Error("Nenhuma carteira encontrada");
      }

      const wallet = walletId
        ? walletsRes.data.find((item) => item.id === walletId)
        : walletsRes.data[0];

      if (!wallet) {
        throw new Error("Carteira nao encontrada");
      }

      const res = await api.get<PortfolioSummary>(`/wallets/${wallet.id}/portfolio`);
      return res.data;
    },
    enabled: true,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}
