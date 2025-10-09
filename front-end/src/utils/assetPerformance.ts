// src/utils/assetPerformance.ts
export type HistoryPoint = number;

/**
 * Gera um histórico simples (array de preços) entre purchasePrice -> currentPrice
 * - Se purchasePrice não for fornecido, gera um purchasePrice "simulado" (5%..20% abaixo do atual)
 * - points define quantos pontos no histórico (ex: 7 para 7 dias)
 * - adiciona um ruído pequeno para parecer mais natural
 */
export function generateMockHistory(
  currentPrice: number,
  purchasePrice?: number,
  points = 7
): HistoryPoint[] {
  const end = currentPrice;
  const start =
    typeof purchasePrice === "number"
      ? purchasePrice
      : currentPrice * (1 - (0.05 + Math.random() * 0.15)); // 5%..20% abaixo

  const arr: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1); // 0..1
    // Interpolação linear entre start e end
    let value = start + t * (end - start);

    // adicionar ruído relativo pequeno (±1.5%)
    const noise = (Math.random() - 0.5) * 0.03 * value;
    value = Math.max(0, value + noise);

    arr.push(parseFloat(value.toFixed(6))); // precisão controlada
  }
  return arr;
}

/** Calcula % de performance entre startPrice e endPrice */
export function performancePercentage(startPrice: number, endPrice: number): number {
  if (!startPrice || startPrice === 0) return 0;
  return ((endPrice - startPrice) / startPrice) * 100;
}

/** Retorna cor hex ou tailwind helper baseado na performance (+ ou -) */
export function performanceColor(startPrice: number, endPrice: number): string {
  const pct = performancePercentage(startPrice, endPrice);
  return pct >= 0 ? "#22c55e" /* green-500 */ : "#ef4444" /* red-500 */;
}
