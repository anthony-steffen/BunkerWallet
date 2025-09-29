// src/hooks/useAuth.ts
import {
	useMutation,
	useQueryClient,
	useQuery as useQueryFn,
} from "@tanstack/react-query";
import api from "@/api/api"; // se o alias "@/api" não funcionar, troque por "../api/api"
import type { AxiosError } from "axios";
import type { User } from "@/types/User";
import { useAuthStore } from "@/store/authStore";

type LoginPayload = { email: string; password: string };
type LoginResponse = { access_token: string; token_type: string };

/** Faz GET /auth/me */
async function fetchCurrentUser(): Promise<User> {
	const { data } = await api.get<User>("/auth/me");
	return data;
}

/** ---------- useRegister ---------- */
type RegisterPayload = { name: string; email: string; password: string };

async function registerRequest(payload: RegisterPayload) {
	const { data } = await api.post("/auth/register", payload);
	return data;
}

export function useRegister() {
	return useMutation({
		mutationFn: (payload: RegisterPayload) => registerRequest(payload),
	});
}

/** ---------- useLogin ---------- */
async function loginRequest({
	email,
	password,
}: LoginPayload): Promise<LoginResponse> {
	const { data } = await api.post<LoginResponse>("/auth/login", {
		email,
		password,
	});
	return data;
}

export function useLogin() {
	const qc = useQueryClient();
	const setToken = useAuthStore((s) => s.setToken);

	return useMutation<LoginResponse, AxiosError, LoginPayload>({
		mutationFn: loginRequest,
		onSuccess: (data) => {
			const token = data.access_token;

			// salva no localStorage
			localStorage.setItem("token", token);

			// configura axios
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			// atualiza zustand store
			setToken(token);

			// força revalidação do user
			qc.invalidateQueries({ queryKey: ["user"] });
		},
	});
}

/** ---------- useLogout ---------- */
export function useLogout() {
	const qc = useQueryClient();

	return useMutation<void, Error, void>({
		mutationFn: async () => {
			// se tiver rota /auth/logout no backend, chame aqui
			localStorage.removeItem("token");
			delete api.defaults.headers.common["Authorization"];
		},
		onSuccess: () => {
			qc.removeQueries({ queryKey: ["user"] });
		},
	});
}

/** ---------- useCurrentUser ---------- */
export function useCurrentUser() {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token && !api.defaults.headers.common["Authorization"]) {
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}
	}

	return useQueryFn<User, AxiosError>({
		queryKey: ["user"],
		queryFn: fetchCurrentUser,
		enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
}
