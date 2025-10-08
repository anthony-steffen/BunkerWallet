import { create } from "zustand";

// 🧠 Tipagem global do estado de autenticação
interface AuthState {
  token: string | null;
  user: {
    id: number;
    email: string;
    name?: string;
  } | null;

  // ✅ Ações (métodos) disponíveis no store
  setToken: (token: string | null) => void;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

// 🧩 Implementação do Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },

  // ✅ Método logout — limpa tudo
  logout: () => {
    set({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
}));

// 🔄 Carregar token e user automaticamente no início do app (opcional)
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");
if (token) {
  useAuthStore.setState({
    token,
    user: userData ? JSON.parse(userData) : null,
  });
}
