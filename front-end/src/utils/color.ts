// src/utils/color.ts
export function getColorForSymbol(symbol: string, apiColor?: string): string {
  if (apiColor) return apiColor; // prioriza cor da API

  const COLORS: Record<string, string> = {
    BTC: "#F7931A",
    ETH: "#627EEA",
    SOL: "#00C49F",
    BNB: "#F3BA2F",
    XRP: "#00AAE4",
    ADA: "#0033AD",
    DOGE: "#C2A633",
    DOT: "#E6007A",
    MATIC: "#8247E5",
  };

  return COLORS[symbol?.toUpperCase()] || "#8884D8"; // fallback roxo
}
