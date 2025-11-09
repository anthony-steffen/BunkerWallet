/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/assets/AssetsTable.tsx
import React from "react";
// import MiniSparklineChart from "@/components/assets/MiniSparklineChart";

interface Props {
  assets: any[];
}

export default function AssetsTable({ assets }: Props) {
  return (
    <table className="w-full text-sm text-gray-200">
      <thead>
        <tr className="text-gray-400 text-xs uppercase border-b border-base-300/30">
          <th className="text-left p-2">#</th>
          <th className="text-left p-2">Nome</th>
          <th className="text-right p-2">Preço</th>
          <th className="text-right p-2">24h</th>
          <th className="text-right p-2">Market Cap</th>
          <th className="text-right p-2">Volume (24h)</th>
          <th className="text-center p-2">Tendência</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((coin: any, i) => {
        console.log(coin);
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <tr
              key={coin.id}
              className="border-b border-base-300/10 hover:bg-base-100/20 transition"
            >
              <td className="p-2 text-gray-500">{i + 1}</td>
              <td className="p-2 flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                <div>
                  <p className="font-semibold">{coin.name}</p>
                  <span className="text-xs text-gray-500">{coin.symbol.toUpperCase()}</span>
                </div>
              </td>
              <td className="text-right">${coin.current_price.toLocaleString()}</td>
              <td className={`text-right ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {isPositive ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="text-right">${coin.market_cap.toLocaleString()}</td>
              <td className="text-right">${coin.total_volume.toLocaleString()}</td>
              <td className="w-[120px]">
                {/* <MiniSparklineChart data={coin.price_change_24h} /> */}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
