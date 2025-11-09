import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function PortfolioDonutChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400 text-center">Nenhum dado disponível</div>;
  }

  return (
    <div className="w-full h-[300px]"> {/* altura explícita! */}
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
