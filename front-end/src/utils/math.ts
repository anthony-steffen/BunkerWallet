export const DEFAULT_FEE_PCT = 0.0025; // 0.25% exemplo, ajustável

export function applyFee(valueUsd: number, feePct = DEFAULT_FEE_PCT) {
  const fee = valueUsd * feePct;
  const net = valueUsd - fee;
  return { fee, net, feePct };
}

export function safeParse(n: string | number | undefined): number {
  if (n === undefined || n === null) return 0;
  const parsed = typeof n === "string" ? parseFloat(n) : Number(n);
  return isNaN(parsed) ? 0 : parsed;
}
