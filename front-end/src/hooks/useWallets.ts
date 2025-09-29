import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Wallet } from "@/types/Wallet";

async function fetchWallets(): Promise<Wallet[]> {
  const { data } = await api.get<Wallet[]>("/wallets");
  return data;
}

export function useWallets() {
  return useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: fetchWallets,
  });
}

export function useCreateWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (wallet: Partial<Wallet>) => {
      const { data } = await api.post<Wallet>("/wallets", wallet);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}