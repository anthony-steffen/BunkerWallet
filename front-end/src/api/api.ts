// src/api/api.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Zustand com token e logout (ajuste o path conforme seu projeto)

// Cria uma instância do Axios configurada com baseURL e cookies
const api = axios.create({
  baseURL: "http://localhost:8000", // ajuste se usar .env
  withCredentials: true, // envia cookies em requests (caso o backend use)
});

// ✅ Interceptor de requisições
// É executado ANTES de cada request enviada à API
api.interceptors.request.use(
  (config) => {
    // Recupera o token armazenado (Zustand, localStorage, etc.)
    const token = useAuthStore.getState().token;

    // Se houver token, adiciona no header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Caso ocorra erro antes de enviar a request (config inválida, etc.)
    return Promise.reject(error);
  }
);

// ✅ Interceptor de respostas
// É executado DEPOIS que a API responde (ou falha)
api.interceptors.response.use(
  (response) => response, // sucesso → passa a resposta adiante

  async (error) => {
    // Verifica se a resposta contém status 401 (token inválido/expirado)
    if (error.response?.status === 401) {
      console.warn("Token expirado ou inválido. Redirecionando para login...");

      try {
        // Chama a função logout do Zustand (ou similar)
        const { logout } = useAuthStore.getState();
        logout(); // limpa token, usuário, etc.
      } catch {
        console.error("Falha ao executar logout automático");
      }

      // Redireciona o usuário para a tela de login
      window.location.href = "/login";
    }

    // Propaga o erro para o React Query ou chamadas diretas
    return Promise.reject(error);
  }
);

export default api;

