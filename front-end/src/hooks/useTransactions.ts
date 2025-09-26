import { useQuery } from "@tanstack/react-query";
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
