// src/utils/generatePriceHistory.ts
export interface PricePoint {
  date: string;
  price: number;
}

/**
 * Gera histórico simulado de preço para sparkline (3 dias).
 */
export function generatePriceHistory(
  currentPrice: number,
  performancePct: number,
  days = 3
): PricePoint[] {
  if (!currentPrice || isNaN(currentPrice) || currentPrice <= 0) {
    return Array.from({ length: days }, (_, i) => ({
      date: `D-${days - i - 1}`,
      price: 1 + i * 0.1,
    }));
  }

  const startPrice = currentPrice / (1 + performancePct / 100);
  const step = (currentPrice - startPrice) / Math.max(1, days - 1);

  const points: PricePoint[] = [];
  for (let i = 0; i < days; i++) {
    const base = startPrice + step * i;
    const noise = Math.sin(i * 1.25) * Math.abs(step) * 0.35;
    const price = Number((base + noise).toFixed(4));
    points.push({ date: `D-${days - i - 1}`, price });
  }

  return points;
}
