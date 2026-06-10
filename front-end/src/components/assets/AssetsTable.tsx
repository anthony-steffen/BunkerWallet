import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { asNumber, formatCompactCurrency, formatCurrency } from "@/utils/format";

interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  image?: string | null;
  current_price?: number | null;
  price_change_percentage_24h?: number | null;
  market_cap?: number | null;
  total_volume?: number | null;
  market_cap_rank?: number | null;
}

interface Props {
  assets: MarketAsset[];
}

function ChangeBadge({ value }: { value?: number | null }) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return (
      <span className="inline-flex items-center justify-end gap-1 text-base-content/45">
        <Minus size={14} /> -
      </span>
    );
  }

  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={`inline-flex items-center justify-end gap-1 font-semibold ${
        positive ? "text-success" : "text-error"
      }`}
    >
      <Icon size={14} />
      {positive ? "+" : ""}
      {formatCurrency(value, 2)}%
    </span>
  );
}

export default function AssetsTable({ assets }: Props) {
  if (!assets.length) {
    return (
      <div className="py-14 text-center text-sm text-base-content/55">
        Nenhum ativo encontrado.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-base-300/70 bg-base-200/70 text-xs uppercase text-base-content/50">
          <th className="w-16 px-4 py-3 text-left">#</th>
          <th className="px-4 py-3 text-left">Ativo</th>
          <th className="px-4 py-3 text-right">Preco</th>
          <th className="px-4 py-3 text-right">24h</th>
          <th className="px-4 py-3 text-right">Market cap</th>
          <th className="px-4 py-3 text-right">Volume 24h</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((coin, index) => (
          <tr
            key={`${coin.id}-${coin.symbol}`}
            className="border-b border-base-300/50 transition hover:bg-base-200/55"
          >
            <td className="px-4 py-3 text-base-content/45">
              {coin.market_cap_rank ?? index + 1}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={coin.image ?? ""}
                  alt={coin.name}
                  className="h-8 w-8 rounded-full bg-base-300"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{coin.name}</p>
                  <span className="text-xs uppercase text-base-content/50">
                    {coin.symbol}
                  </span>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-right font-medium">
              ${formatCurrency(asNumber(coin.current_price, NaN), 2)}
            </td>
            <td className="px-4 py-3 text-right">
              <ChangeBadge value={coin.price_change_percentage_24h} />
            </td>
            <td className="px-4 py-3 text-right text-base-content/70">
              ${formatCompactCurrency(coin.market_cap)}
            </td>
            <td className="px-4 py-3 text-right text-base-content/70">
              ${formatCompactCurrency(coin.total_volume)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
