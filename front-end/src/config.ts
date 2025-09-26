// src/config.ts
export const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://suaapiemproducao.com"; // ajuste para quando for deploy
