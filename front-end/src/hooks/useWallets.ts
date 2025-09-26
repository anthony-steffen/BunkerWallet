import { useQuery } from "@tanstack/react-query";
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
