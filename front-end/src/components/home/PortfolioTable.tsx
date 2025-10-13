/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/home/PortfolioTable.tsx
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import AssetPerformanceChart from "@/components/home/AssetPerformanceChart";
import { generatePriceHistory } from "@/utils/generatePriceHistory";
import { getColorForSymbol } from "@/utils/color";

interface PortfolioAsset {
	color: any;
	name: string;
	symbol: string;
	image: string;
	quantity: number;
	current_price: number;
	purchase_price?: number;
	value_usd: number;
	percentage: number;
	performance_pct?: number;
	price_24h_ago?: number;
	change_24h_usd?: number;
	performance_pct_24h?: number; // ✅ Tornar opcional
}

interface Props {
	assets: PortfolioAsset[];
}

export default function PortfolioTable({ assets }: Props) {
	if (!assets || assets.length === 0)
		return (
			<div className="text-gray-500 text-center py-10">
				Nenhum ativo encontrado
			</div>
		);

	return (
		<div className="w-full">
			<div className="hidden lg:block overflow-x-auto">
				<table className="w-full m-auto text-sm text-gray-200 lg:w-3/4">
					<thead>
						<tr className="text-gray-400 text-xs uppercase border-b border-base-300/30">
							<th className="pb-3 text-left">Asset Name</th>
							<th className="pb-3 text-right">Price</th>
							<th className="pb-3 text-right">24H Change</th>
							<th className="pb-3 text-center">3D Day Trend</th>
							<th className="pb-3 text-right">Performance</th>
							<th className="pb-3 text-right">Balance</th>
							<th className="pb-3 text-right">Value</th>
							<th className="pb-3 text-right">Portfolio</th>
						</tr>
					</thead>

					<tbody>
						{assets.map((asset) => {
							const color = asset.color || getColorForSymbol(asset.symbol);
							const perfTotal = asset.performance_pct ?? 0; // ganho total desde a compra
							const perf24h = asset.performance_pct_24h ?? 0; // variação de mercado 24h
							// const changeUsd = asset.change_24h_usd ?? 0;

							console.log(asset.color);

							// 🔁 histórico para o gráfico de linha
							const trendPoints = generatePriceHistory(
								asset.current_price,
								perf24h,
								3
							);

							return (
								<tr
									key={asset.symbol}
									className="border-b border-base-300/10 hover:bg-base-100/20 transition">
									{/* ASSET */}
									<td className="py-3 flex items-center gap-3">
										<img
											src={asset.image}
											alt={asset.name}
											className="w-7 h-7 rounded-full shadow-md"
										/>
										<div>
											<p className="font-semibold text-gray-100">
												{asset.name}
											</p>
											<span className="text-xs text-gray-500">
												{asset.symbol}
											</span>
										</div>
									</td>

									{/* PRICE */}
									<td className="text-right text-gray-300">
										${asset.current_price.toFixed(2)}
									</td>

									{/* 24H CHANGE */}
									<td
										className={`text-right ${
											perf24h >= 0 ? "text-green-400" : "text-red-400"
										}`}>
										<div className="flex items-center justify-end gap-1">
											{perf24h >= 0 ? (
												<TrendingUp size={14} />
											) : (
												<TrendingDown size={14} />
											)}
											<span>
												{perf24h >= 0 ? "+" : "-"}
												{Math.abs(perf24h).toFixed(2)}%
											</span>
										</div>
									</td>

									{/* 3D TREND */}
									<td className="px-4 py-3 w-[160px]">
										<AssetPerformanceChart
											points={trendPoints}
											strokeColor={
												asset.color || getColorForSymbol(asset.symbol)
											}
											height={56}
										/>
									</td>

									{/* PERFORMANCE TOTAL (desde compra) */}
									<td
										className={`text-right ${
											perfTotal >= 0 ? "text-green-400" : "text-red-400"
										}`}>
										{perfTotal >= 0 ? "+" : ""}
										{perfTotal.toFixed(2)}%
									</td>

									{/* BALANCE */}
									<td
										className="text-right font-semibold"
										style={{
											color,
											textShadow: `0 0 6px ${color}80`,
										}}>
										{asset.quantity.toFixed(2)}
									</td>

									{/* VALUE */}
									<td className="text-right text-gray-100">
										${asset.value_usd.toFixed(2)}
									</td>

									{/* PORTFOLIO */}
									<td className="text-right text-gray-400">
										{asset.percentage.toFixed(1)}%
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{/* ======= CARDS (MOBILE) ======= */}
			<div className="block lg:hidden space-y-3 mt-4">
				{assets.map((asset) => {
					const isPositive = (asset.performance_pct ?? 0) >= 0;
					const color = isPositive ? "text-green-400" : "text-red-400";
					const Icon = isPositive ? TrendingUp : TrendingDown;

					return (
						<div
							key={asset.symbol}
							className="bg-base-100/10 rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-base-100/20 transition">
							{/* Esquerda: ícone e nome */}
							<div className="flex items-center gap-3">
								<img
									src={asset.image}
									alt={asset.name}
									className="w-10 h-10 rounded-full"
								/>
								<div>
									<p className="font-semibold text-gray-100">{asset.name}</p>
									<p className="text-xs text-gray-500">{asset.symbol}</p>
								</div>
							</div>

							{/* Direita: valores */}
							<div className="text-right">
								<p className="text-sm text-gray-300 font-semibold">
									${asset.current_price.toFixed(2)}
								</p>
								<p className="text-xs text-gray-500">
									{asset.quantity.toFixed(5)} {asset.symbol}
								</p>
								<p
									className={`text-xs font-semibold ${color} ${
										isPositive ? "glow-green" : "glow-red"
									}`}>
									<Icon size={12} className="inline mr-1" />
									{isPositive ? "+" : ""}
									{Math.abs(asset.performance_pct ?? 0).toFixed(2)}%
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
