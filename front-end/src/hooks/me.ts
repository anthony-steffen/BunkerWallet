import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { User } from "@/types/User";

async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    retry: false, // não ficar em loop se o token for inválido
  });
}
