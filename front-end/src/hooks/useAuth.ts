import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { User } from "@/types/User";

// ----------------------
// 🔹 Tipagens
// ----------------------
interface LoginResponse {
  access_token: string;
  token_type: string;
}

// ----------------------
// 🔹 Requests (API)
// ----------------------

// POST /auth/login
async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
  return data;
}

// POST /auth/logout (opcional, depende do backend)
async function logoutRequest(): Promise<void> {
  await api.post("/auth/logout");
}

// GET /auth/me
async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

// ----------------------
// 🔹 Hooks
// ----------------------

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),
    onSuccess: (data) => {
      // salva token no localStorage
      localStorage.setItem("token", data.access_token);

      // configura axios para sempre enviar o JWT
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

      // invalida cache do usuário → força refetch em useCurrentUser
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      // remove token
      localStorage.removeItem("token");

      // limpa header do axios
      delete api.defaults.headers.common["Authorization"];

      // remove cache do usuário
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });
}

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    retry: false, // não ficar tentando sem token
  });
}
