import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { asNumber, formatCurrency, formatNumber } from "@/utils/format";

interface PortfolioAsset {
  color?: string;
  name: string;
  symbol: string;
  image?: string | null;
  quantity: number;
  current_price?: number | null;
  purchase_price?: number | null;
  value_usd?: number | null;
  percentage: number;
  performance_pct?: number | null;
  performance_pct_24h?: number | null;
}

interface Props {
  assets: PortfolioAsset[];
}

function PercentCell({ value }: { value?: number | null }) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return <span className="text-base-content/45">-</span>;
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

export default function PortfolioTable({ assets }: Props) {
  if (!assets || assets.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-dashed border-base-300 p-10 text-center">
        <p className="font-medium">Nenhum ativo encontrado</p>
        <p className="mt-1 text-sm text-base-content/55">
          Registre uma compra para acompanhar posicao, preco medio e performance.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hidden overflow-x-auto rounded-lg border border-base-300/70 bg-base-100/75 lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-300/70 bg-base-200/70 text-xs uppercase text-base-content/50">
              <th className="px-4 py-3 text-left">Ativo</th>
              <th className="px-4 py-3 text-right">Preco medio</th>
              <th className="px-4 py-3 text-right">Preco atual</th>
              <th className="px-4 py-3 text-right">Quantidade</th>
              <th className="px-4 py-3 text-right">Saldo</th>
              <th className="px-4 py-3 text-right">24h</th>
              <th className="px-4 py-3 text-right">Performance</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.symbol}
                className="border-b border-base-300/50 transition hover:bg-base-200/55"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={asset.image ?? ""}
                      alt={asset.name}
                      className="h-9 w-9 rounded-full bg-base-300"
                    />
                    <div>
                      <p className="font-semibold">{asset.name}</p>
                      <span className="text-xs text-base-content/50">
                        {asset.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  ${formatCurrency(asset.purchase_price, 2)}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  ${formatCurrency(asset.current_price, 2)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(asset.quantity, 6)}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  ${formatCurrency(asset.value_usd, 2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <PercentCell value={asset.performance_pct_24h} />
                </td>
                <td className="px-4 py-3 text-right">
                  <PercentCell value={asset.performance_pct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {assets.map((asset) => {
          const performance = asNumber(asset.performance_pct);
          const isPositive = performance >= 0;
          const Icon = isPositive ? TrendingUp : TrendingDown;

          return (
            <div key={asset.symbol} className="glass-panel rounded-lg p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={asset.image ?? ""}
                    alt={asset.name}
                    className="h-10 w-10 rounded-full bg-base-300"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{asset.name}</p>
                    <p className="text-xs text-base-content/50">{asset.symbol}</p>
                  </div>
                </div>
                <p
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${
                    isPositive ? "text-success" : "text-error"
                  }`}
                >
                  <Icon size={14} />
                  {isPositive ? "+" : ""}
                  {formatCurrency(performance, 2)}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-base-content/50">Saldo</p>
                  <p className="font-semibold">${formatCurrency(asset.value_usd, 2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-base-content/50">Preco</p>
                  <p className="font-semibold">
                    ${formatCurrency(asset.current_price, 2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-base-content/50">Quantidade</p>
                  <p>{formatNumber(asset.quantity, 6)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-base-content/50">Peso</p>
                  <p>{formatCurrency(asset.percentage, 1)}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
