/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import LayoutDashboard from "@/components/layout/LayoutDashboard";
import AssetsTable from "@/components/assets/AssetsTable";
import AssetCard from "@/components/assets/AssetCard";
import { Header } from "@/components/layout/Header";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTopAssets } from "@/hooks/useAssets";
import { useMarketStream } from "@/hooks/useMarket";

export default function AssetsPage() {
	const [search, setSearch] = useState("");
	const { refetch } = usePortfolio();
	const { data: topAssets = [], isLoading, isError } = useTopAssets();
	const streamSymbols = topAssets.slice(0, 25).map((coin: any) => coin.symbol);
	const { prices, isLive } = useMarketStream(streamSymbols);

	const liveAssets = useMemo(
		() =>
			topAssets.map((coin: any) => {
				const live = prices[coin.symbol.toUpperCase()];
				return {
					...coin,
					current_price: live?.price ?? coin.current_price,
					price_change_percentage_24h:
						live?.change_pct_24h ?? coin.price_change_percentage_24h,
					market_cap: live?.market_cap ?? coin.market_cap,
					total_volume: live?.volume_24h ?? coin.total_volume,
					last_updated: live?.last_updated_at ?? coin.last_updated,
				};
			}),
		[topAssets, prices]
	);

	const filtered = liveAssets.filter(
		(coin: any) =>
			coin.name.toLowerCase().includes(search.toLowerCase()) ||
			coin.symbol.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="min-h-screen text-white flex flex-col">
			<LayoutDashboard>
				<Header walletName="Mercado" onRefresh={refetch} />

				<main className="mx-auto mt-24 w-full max-w-6xl px-4 pb-24">
					<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-xl font-semibold">Criptoativos</h1>
							<p className="text-sm text-gray-400">
								Precos, volume e variacao de mercado
							</p>
						</div>

						<div className="flex items-center gap-3">
							<div className="inline-flex items-center gap-2 rounded-full border border-base-300/40 bg-base-100/70 px-3 py-1 text-xs text-gray-300">
								<span
									className={`h-2 w-2 rounded-full ${
										isLive ? "bg-green-400" : "bg-yellow-400"
									}`}
								/>
								{isLive ? "Ao vivo" : "Atualizando"}
							</div>
							<input
								type="search"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Buscar ativo"
								className="input input-sm input-bordered bg-base-100 text-gray-100"
							/>
						</div>
					</div>

					{isLoading && <p className="text-gray-400">Carregando ativos...</p>}
					{isError && <p className="text-red-400">Erro ao carregar ativos.</p>}

					{!isLoading && !isError && (
						<>
							<div className="hidden lg:block overflow-x-auto rounded-lg border border-base-300/30 bg-base-100/40">
								<AssetsTable assets={filtered} />
							</div>

							<div className="block lg:hidden space-y-4">
								{filtered.map((coin: any) => (
									<AssetCard key={coin.id} coin={coin} />
								))}
							</div>
						</>
					)}
				</main>
			</LayoutDashboard>
		</div>
	);
}
