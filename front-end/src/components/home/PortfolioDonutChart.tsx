/* src/components/home/PortfolioDonutChart.tsx */
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AssetDatum {
  name: string;
  symbol: string;
  value_usd: number;
  percentage: number;
  color?: string;
  [key: string]: string | number | undefined;
}

interface PortfolioDonutChartProps {
  data: AssetDatum[];
  total?: number;
}

// fallback palette (usada apenas se api não fornecer color)
const FALLBACK_COLORS = [
  "#00C49F", "#F3BA2F", "#00AAE4", "#F7931A", "#627EEA", "#8247E5",
  "#36A2EB", "#FF6384", "#9966FF", "#4BC0C0",
];

export function PortfolioDonutChart({ data, total }: PortfolioDonutChartProps) {

  return (
    <div className="relative flex flex-col items-center justify-center mt-10">
      <div className="relative w-[320px] h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value_usd"
              nameKey="symbol"
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={100}
              stroke="none"
            >
              {data.map((asset, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={asset.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Valor centralizado */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <p className="text-3xl font-bold text-white">
            $
            {Number(total ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-400">Saldo total</p>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((asset, i) => (
          <div key={i} className="flex items-center space-x-2 text-xs">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: asset.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length] }}
            />
            <span className="text-gray-300">{asset.symbol}</span>
            <span className="text-gray-500">({Number(asset.percentage).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioDonutChart;
