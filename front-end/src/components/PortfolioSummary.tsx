// src/components/Home/PortfolioSummary.tsx
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import api from "../api/api";

ChartJS.register(ArcElement, Tooltip, Legend);

type Asset = {
  id: number;
  name: string;
  symbol: string;
  price: number;
  quantity: number;
  image: string;
};

export default function PortfolioSummary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/assets");
        const data = res.data;

        setAssets(data);

        const totalValue = data.reduce(
          (sum: number, asset: Asset) => sum + asset.price * asset.quantity,
          0
        );
        setTotal(totalValue);
      } catch (err) {
        console.error("Erro ao carregar assets", err);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: assets.map((a) => a.symbol),
    datasets: [
      {
        data: assets.map((a) => a.price * a.quantity),
        backgroundColor: [
          "#f59e0b", // amarelo
          "#3b82f6", // azul
          "#10b981", // verde
          "#ef4444", // vermelho
          "#8b5cf6", // roxo
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card bg-base-200 shadow p-4">
      <h2 className="text-lg font-bold mb-2">Resumo do Portfólio</h2>

      {/* Valor total */}
      <p className="text-3xl font-bold text-success">
        ${total.toLocaleString()}
      </p>
      <p className="text-sm text-gray-400 mb-4">+2.5% nas últimas 24h</p>

      {/* Gráfico */}
      <div className="flex justify-center">
        <div className="w-48 h-48">
          <Pie data={chartData} />
        </div>
      </div>

      {/* Lista de ativos */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {assets.slice(0, 4).map((asset) => {
          const value = asset.price * asset.quantity;
          const percentage = ((value / total) * 100).toFixed(2);

          return (
            <div
              key={asset.id}
              className="card bg-base-100 shadow p-3 flex flex-col items-center"
            >
              <img src={asset.image} alt={asset.symbol} className="w-6 h-6 mb-1" />
              <p className="text-sm font-bold">{asset.name}</p>
              <p className="text-xs text-gray-400">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}