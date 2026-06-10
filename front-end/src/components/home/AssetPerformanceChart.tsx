import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PerformanceSlice {
  symbol: string;
  percentage: number;
  color?: string;
}

export default function AssetPerformanceChart({ data }: { data: PerformanceSlice[] }) {
  if (!data.length) {
    return <div className="text-center text-base-content/55">Nenhum dado disponivel</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="symbol"
            cx="50%"
            cy="50%"
            outerRadius="80%"
          >
            {data.map((entry) => (
              <Cell key={entry.symbol} fill={entry.color || "#22d3ee"} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
