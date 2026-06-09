import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import type { Assets } from "@/types/Assets";
import type { Wallet } from "@/types/Wallet";

export type TransactionType = "buy" | "sell" | "deposit" | "withdraw";

export interface Transaction {
  id: number;
  wallet_id: number;
  asset_id: number;
  amount: number;
  price: number;
  type: TransactionType;
  description?: string | null;
  tx_hash?: string | null;
  timestamp: string;
  asset?: Assets;
  wallet?: Wallet;
}

export interface CreateTransactionInput {
  wallet_id: number;
  asset_id: number;
  amount: number;
  price?: number;
  type: TransactionType;
  description?: string;
  tx_hash?: string;
}

export interface CreateSwapInput {
  wallet_id: number;
  from_asset_id: number;
  to_asset_id: number;
  from_amount: number;
  from_price: number;
  to_amount: number;
  to_price: number;
  description?: string;
}

export function useTransactions(walletId?: number) {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ["transactions", walletId],
    queryFn: async () => {
      const res = await api.get("/transactions", {
        params: walletId ? { wallet_id: walletId } : undefined,
      });
      return res.data;
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      const res = await api.post("/transactions", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const createSwap = useMutation({
    mutationFn: async (data: CreateSwapInput) => {
      const res = await api.post("/transactions/swap", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  return {
    ...transactionsQuery,
    createTransaction,
    createSwap,
  };
}
