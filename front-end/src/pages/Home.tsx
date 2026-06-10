import LayoutDashboard from "@/components/layout/LayoutDashboard";
import { useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { FooterActions } from "@/components/home/FooterActions";
import { PortfolioDonutChart } from "@/components/home/PortfolioDonutChart";
import PortfolioTable from "@/components/home/PortfolioTable";
import { useMarketStream } from "@/hooks/useMarket";
import { usePortfolio } from "@/hooks/usePortfolio";
import { asNumber } from "@/utils/format";

export default function Home() {
	const { data: portfolio, isLoading, refetch } = usePortfolio();
	const symbols = useMemo(
		() => portfolio?.assets.map((asset) => asset.symbol) ?? [],
		[portfolio?.assets]
	);
	const { prices, isLive, lastMessageAt } = useMarketStream(symbols);

	const liveAssets = (portfolio?.assets ?? []).map((asset) => {
		const live = prices[asset.symbol.toUpperCase()];
		const quantity = asNumber(asset.quantity);
		const livePrice = asNumber(live?.price ?? asset.current_price);
		const purchasePrice = asNumber(asset.purchase_price);
		const valueUsd = quantity * livePrice;
		const performancePct =
			purchasePrice > 0
				? ((livePrice - purchasePrice) / purchasePrice) * 100
				: asNumber(asset.performance_pct);
		const price24hAgo = asNumber(live?.price_24h_ago ?? asset.price_24h_ago);
		const change24hUsd =
			price24hAgo > 0
				? (livePrice - price24hAgo) * quantity
				: asNumber(asset.change_24h_usd);

		return {
			...asset,
			quantity,
			current_price: livePrice,
			value_usd: valueUsd,
			performance_pct: performancePct,
			price_24h_ago: price24hAgo,
			change_24h_usd: change24hUsd,
			performance_pct_24h: asNumber(live?.change_pct_24h ?? asset.performance_pct_24h),
			last_price_update: live?.last_updated_at ?? asset.last_price_update,
		};
	});

	const liveTotal = liveAssets.reduce((sum, asset) => sum + asNumber(asset.value_usd), 0);
	const livePortfolioAssets = liveAssets.map((asset) => ({
		...asset,
		percentage: liveTotal > 0 ? (asset.value_usd / liveTotal) * 100 : 0,
	}));

	return (
		<div className="min-h-screen text-white flex flex-col">
			<LayoutDashboard>
				<Header walletName="Minha Carteira" onRefresh={refetch} />

				<main className="flex-1 flex flex-col items-center pb-24">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<span className="loading loading-spinner loading-lg text-primary" />
						</div>
					) : (
						portfolio && (
							<div className="grid grid-cols-1 gap-10 w-full">
								<div className="mt-20 flex justify-center">
									<div className="inline-flex items-center gap-2 rounded-full border border-base-300/40 bg-base-100/70 px-3 py-1 text-xs text-gray-300">
										<span
											className={`h-2 w-2 rounded-full ${
												isLive ? "bg-green-400" : "bg-yellow-400"
											}`}
										/>
										<span>{isLive ? "Precos ao vivo" : "Atualizacao periodica"}</span>
										{lastMessageAt && (
											<span className="text-gray-500">
												{new Date(lastMessageAt).toLocaleTimeString()}
											</span>
										)}
									</div>
								</div>

								<div className="flex flex-col items-center justify-center">
									<PortfolioDonutChart
										total={liveTotal}
										data={livePortfolioAssets.map((asset) => ({
											name: asset.name,
											symbol: asset.symbol,
											value_usd: asset.value_usd,
											percentage: asset.percentage,
											color: asset.color,
										}))}
									/>
								</div>

								<div>
									<PortfolioTable
										assets={livePortfolioAssets.map((asset) => ({
											...asset,
											performance_pct: asset.performance_pct ?? 0,
											color: asset.color ?? "#8884d8",
										}))}
									/>
								</div>
							</div>
						)
					)}
				</main>

				<FooterActions />
			</LayoutDashboard>
		</div>
	);
}
