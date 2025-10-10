// src/utils/generatePriceHistory.ts

export interface PricePoint {
  date: string;
  price: number;
}

export function generatePriceHistory(
  currentPrice: number,
  performancePct: number,
  days: number = 10
): PricePoint[] {
  if (!currentPrice || isNaN(currentPrice)) {
    return [];
  }

  const history: PricePoint[] = [];

  // preço inicial estimado com base na performance total
  // ex: se +10%, preço inicial ≈ atual / 1.10
  const startPrice =
    performancePct !== 0
      ? currentPrice / (1 + performancePct / 100)
      : currentPrice * 0.95; // fallback leve

  // cria incremento diário (linear aproximado)
  const delta = (currentPrice - startPrice) / days;

  for (let i = 0; i < days; i++) {
    // adiciona um pequeno ruído para dar aparência mais orgânica
    const variation = (Math.random() - 0.5) * delta * 0.4;
    const price = startPrice + delta * i + variation;

    history.push({
      date: `Day ${i + 1}`,
      price: Number(price.toFixed(2)),
    });
  }

  return history;
}
