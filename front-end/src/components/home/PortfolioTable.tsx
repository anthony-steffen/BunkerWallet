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
							<th className="pb-3 text-center">Purcharge Price</th>
							<th className="pb-3 text-right">Current Price</th>
							<th className="pb-3 text-right">Balance</th>
							<th className="pb-3 text-right">24H Change</th>
							<th className="pb-3 text-right">Performance</th>
						</tr>
					</thead>

					<tbody>
						{assets.map((asset) => {
							return (
								<tr
									key={asset.symbol}
									className="border-b border-base-300/10 hover:bg-base-100/20 transition"
								>
									{/* Nome do ativo */}
									<td className="p-2 flex items-center gap-3">
										<img
											src={asset.image}
											alt={asset.name}
											className="w-8 h-8 rounded-full"
										/>
										<div>
											<p className="font-semibold">{asset.name}</p>
											<span className="text-xs text-gray-500">
												{asset.symbol}
											</span>
										</div>
									</td>

									{/* Preço de compra */}
									<td className="p-2 text-center">
										${asset.purchase_price?.toFixed(2) ?? "N/A"}
									</td>

									{/* Preço atual */}
									<td className="p-2 text-right">
										${asset.current_price.toFixed(2)}
									</td>

									{/* Valor total */}
									<td className="p-2 text-right">
										${asset.value_usd.toFixed(2)}	
									</td>		

									{/* Variação 24h */}
									<td className={`p-2 text-right ${(asset.performance_pct_24h ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
										{asset.performance_pct_24h !== undefined ? asset.performance_pct_24h.toFixed(2) : "N/A"}%
									</td>	
									{/* Performance total */}
									<td className={`p-2 text-right ${(asset.performance_pct ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
										{asset.performance_pct?.toFixed(2) ?? "N/A"}%
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
