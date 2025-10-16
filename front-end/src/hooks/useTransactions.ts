// src/hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api  from "@/api/api";

export interface Transaction {
  id: number;
  wallet_id: number;
  symbol: string;
  quantity: number;
  price_usd: number;
  type: "buy" | "swap" | "send";
  timestamp: string;
}

export interface CreateTransactionInput {
  wallet_id: number;
  symbol: string;
  quantity: number;
  price_usd: number;
  type: "buy" | "swap" | "send";
}

export function useTransactions(walletId?: number) {
  const queryClient = useQueryClient();

  // GET /transactions?wallet_id=1
  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ["transactions", walletId],
    queryFn: async () => {
      const res = await api.get(`/transactions`, {
        params: { wallet_id: walletId },
      });
      return res.data;
    },
    enabled: !!walletId,
  });

  // POST /transactions
  const createTransaction = useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      const res = await api.post(`/transactions`, data);
      return res.data;
    },
    onSuccess: () => {
      // Atualiza automaticamente o portfólio e transações
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  return {
    ...transactionsQuery,
    createTransaction,
  };
}
