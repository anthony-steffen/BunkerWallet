import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { asNumber, formatCompactCurrency, formatCurrency } from "@/utils/format";

interface Props {
  coin: {
    id: string;
    name: string;
    symbol: string;
    image?: string | null;
    current_price?: number | null;
    price_change_percentage_24h?: number | null;
    market_cap?: number | null;
    market_cap_rank?: number | null;
  };
}

export default function AssetCard({ coin }: Props) {
  const change = coin.price_change_percentage_24h;
  const hasChange = change !== null && change !== undefined && Number.isFinite(change);
  const isPositive = asNumber(change) >= 0;
  const Icon = !hasChange ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="glass-panel rounded-lg p-4 transition hover:-translate-y-0.5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={coin.image ?? ""}
            alt={coin.name}
            className="h-9 w-9 rounded-full bg-base-300"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold">{coin.name}</p>
            <p className="text-xs uppercase text-base-content/50">{coin.symbol}</p>
          </div>
        </div>
        <span className="text-xs text-base-content/45">
          #{coin.market_cap_rank ?? "-"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-base-content/50">Preco</p>
          <p className="font-semibold">
            ${formatCurrency(asNumber(coin.current_price, NaN), 2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-base-content/50">24h</p>
          <p
            className={`inline-flex items-center justify-end gap-1 font-semibold ${
              !hasChange ? "text-base-content/45" : isPositive ? "text-success" : "text-error"
            }`}
          >
            <Icon size={14} />
            {hasChange ? `${isPositive ? "+" : ""}${formatCurrency(change, 2)}%` : "-"}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-base-content/50">Market cap</p>
          <p className="font-medium">${formatCompactCurrency(coin.market_cap)}</p>
        </div>
      </div>
    </div>
  );
}
