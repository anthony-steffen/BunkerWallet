import { TrendingUp, TrendingDown } from "lucide-react";
import { AssetPerformanceChart } from "@/components/home/AssetPerformanceChart";
import { generatePriceHistory } from "@/utils/generatePriceHistory";

interface PortfolioAsset {
	name: string;
	symbol: string;
	image: string;
	quantity: number;
	current_price: number;
	value_usd: number;
	performance_pct: number;
	percentage: number;
}

interface Props {
	assets: PortfolioAsset[];
}

export function PortfolioTable({ assets }: Props) {
	return (
		<div className="w-full overflow-x-auto">
			<table className="table w-full text-sm text-gray-200">
				<thead>
					<tr className="text-gray-400 text-xs uppercase border-b border-base-300/30">
						<th className="pb-3">Asset Name</th>
						<th className="pb-3 text-right">Price</th>
						<th className="pb-3 text-right">24h Change</th>
						<th className="pb-3 text-center">3D Day Trend</th>
						<th className="pb-3 text-right">Balance</th>
						<th className="pb-3 text-right">Value</th>
						<th className="pb-3 text-right">Portfolio</th>
					</tr>
				</thead>

				<tbody>
					{assets.map((asset) => {
						const changeUsd =
							(asset.current_price - asset.current_price / 1.01) *
							asset.quantity;
						const isPositive = changeUsd >= 0;

						const color = isPositive ? "text-green-400" : "text-red-400";
						const Icon = isPositive ? TrendingUp : TrendingDown;

						// Gera histórico dos últimos 3 dias
						const trendData = generatePriceHistory(
							asset.current_price ?? 0,
							asset.performance_pct ?? 0,
							3
						);

						return (
							<tr
								key={asset.symbol}
								className="border-b border-base-300/10 hover:bg-base-100/20 transition-all">
								{/* Asset */}
								<td className="py-3 flex items-center gap-3">
									<img
										src={asset.image}
										alt={asset.name}
										className="w-7 h-7 rounded-full shadow-md"
									/>
									<div>
										<p className="font-semibold text-gray-100">{asset.name}</p>
										<p className="text-xs text-gray-500">{asset.symbol}</p>
									</div>
								</td>

								{/* Price */}
								<td className="text-right font-medium text-gray-300">
									${asset.current_price.toFixed(2)}
								</td>

								{/* 24h Change */}
								<td className={`text-right font-medium ${color}`}>
									<div
										className={`flex items-center justify-end gap-1 ${isPositive ? "glow-green" : "glow-red"}`}>
										<Icon size={14} />
										<span>
											{isPositive ? "+" : ""}${Math.abs(changeUsd).toFixed(2)}
										</span>
									</div>
								</td>

								{/* 3D Trend */}
								<td className="text-center">
									<div className="flex justify-center w-[120px]">
										<AssetPerformanceChart
											data={trendData}
											performance_pct={asset.performance_pct}
											height={40}
										/>
									</div>
								</td>

								{/* Balance */}
								<td className="text-right text-gray-300">
									{asset.quantity.toFixed(4)}
								</td>

								{/* Value */}
								<td
									className={`text-right font-semibold ${isPositive ? "glow-green" : "glow-red"}`}>
									${asset.value_usd.toFixed(2)}
								</td>

								{/* Portfolio */}
								<td className="text-right">
									<span className="text-sm text-gray-400">
										{asset.percentage.toFixed(1)}%
									</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
