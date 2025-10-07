// src/components/Dashboard/PortfolioSummary.tsx
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = [
  "#FFD700", // ouro
  "#4FD1C5", // teal
  "#F56565", // vermelho
  "#4299E1", // azul
  "#9F7AEA", // roxo
];

export default function PortfolioSummary({ data }: { data: any }) {
  if (!data) return null;

  const assets = data.assets || [];
  const chartData = assets.map((a: any) => ({
    name: a.symbol,
    value: a.value_usd,
  }));

  return (
    <div className="bg-base-100 rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-2">Resumo do Portfólio</h2>
      <p className="text-gray-400 mb-4">
        Saldo total: ${data.total_balance.toFixed(2)}
      </p>

      {assets.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <PieChart width={200} height={200}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <ul className="flex-1 space-y-2">
            {assets.map((a: any) => (
              <li key={a.symbol} className="flex justify-between">
                <span className="flex items-center gap-2">
                  <img src={a.image} alt={a.symbol} className="w-5 h-5 rounded-full" />
                  {a.symbol} ({a.quantity})
                </span>
                <span>${a.value_usd.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-400">Nenhum ativo na carteira</p>
      )}
    </div>
  );
}
