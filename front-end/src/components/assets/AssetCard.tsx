/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/assets/AssetCard.tsx
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import MiniSparklineChart from "./MiniSparklineChart";

interface Props {
  coin: any;
}

export default function AssetCard({ coin }: Props) {
  const isPositive = coin.price_change_percentage_24h >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const color = isPositive ? "text-green-400" : "text-red-400";

  return (
    <div className="bg-base-100/10 rounded-xl p-4 flex flex-col shadow-md hover:bg-base-100/20 transition">
      {/* Top: Nome e símbolo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-5 h-5 rounded-full shadow"
          />
          <div>
            <p className="font-semibold text-gray-100 text-sm">{coin.name}</p>
            <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">#{coin.market_cap_rank}</span>
      </div>

      {/* Middle: Gráfico */}
      <div className="h-[15px]">
        <MiniSparklineChart data={coin.sparkline_in_7d.price} />
      </div>

      {/* Bottom: Dados principais */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-gray-400">Preço</p>
          <p className="text-gray-100 font-semibold">
            ${coin.current_price.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-400">24h</p>
          <p className={`font-semibold flex items-center justify-end ${color}`}>
            <Icon size={14} className="mr-1" />
            {isPositive ? "+" : ""}
            {coin.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
