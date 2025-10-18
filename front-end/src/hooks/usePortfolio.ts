// src/hooks/usePortfolio.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export interface Asset {
  name: string;
  symbol: string;
  color: string;
  image: string;
  quantity: number;
  current_price: number;
  purchase_price?: number;
  value_usd: number;
  performance_pct?: number;
  price_24h_ago?: number;
  change_24h_usd?: number;
  performance_pct_24h?: number;
  percentage: number;
}

export interface PortfolioSummary {
  total_balance: number;
  assets: Asset[];
}

export function usePortfolio(walletId?: number) {
  return useQuery<PortfolioSummary>({
    queryKey: ["portfolio", walletId],
    queryFn: async () => {
      console.log("🚀 usePortfolio → Iniciando fetch...");
      console.log("walletId recebido:", walletId);

      const walletsRes = await api.get("/wallets/");
      console.log("🔍 /wallets/ response:", walletsRes.data);

      if (!walletsRes.data?.length)
        throw new Error("Nenhuma carteira encontrada");

      const wallet = walletId
        ? walletsRes.data.find((w: any) => w.id === walletId)
        : walletsRes.data[0];

      if (!wallet) throw new Error("Carteira não encontrada!");

      console.log("🎯 Carteira usada:", wallet);

      const res = await api.get(`/wallets/${wallet.id}/portfolio`);
      console.log("📊 /wallets/{id}/portfolio →", res.data);

      return res.data;
    },
    enabled: true, // ⚠️ Temporariamente deixa sempre ativo para debugar
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}
