import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Transaction } from "@/types/Transaction";

async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data;
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (transaction: Partial<Transaction>) => {
      const { data } = await api.post<Transaction>("/transactions", transaction);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}