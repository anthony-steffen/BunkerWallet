import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PortfolioDonutChartProps {
	data: {
		name: string;
		symbol: string;
		value_usd: number;
		percentage: number;
	}[];
	total?: number;
}

// Paleta inspirada na Exodus (tons vibrantes e diferenciáveis)
const COLORS = [
	"#00C49F", // verde-água
	"#FFBB28", // amarelo ouro
	"#FF8042", // laranja
	"#8884D8", // roxo
	"#00BFFF", // azul celeste
	"#FF6384", // rosa
	"#36A2EB", // azul
	"#9966FF", // lilás
];

export function PortfolioDonutChart({ data, total }: PortfolioDonutChartProps) {
	return (
		<div className="relative flex flex-col items-center justify-center mt-10">
			<div className="relative w-[320px] h-[320px]">
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={data}
							dataKey="value_usd"
							nameKey="symbol"
							cx="50%"
							cy="50%"
							innerRadius={90}
							outerRadius={120}
							stroke="none">
							{data.map((_, i) => (
								<Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
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
							style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
						<span className="text-gray-300">{asset.symbol}</span>
						<span className="text-gray-500">
							({Number(asset.percentage).toFixed(1)}%)
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
