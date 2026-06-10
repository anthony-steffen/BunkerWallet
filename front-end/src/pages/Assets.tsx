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
	const streamSymbols = useMemo(
		() => topAssets.slice(0, 25).map((coin: any) => coin.symbol),
		[topAssets]
	);
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
		<div className="flex min-h-screen flex-col text-base-content">
			<LayoutDashboard>
				<Header walletName="Mercado" onRefresh={refetch} />

				<main className="mx-auto mt-24 w-full max-w-6xl px-4 pb-24">
					<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-xl font-semibold">Criptoativos</h1>
							<p className="text-sm wallet-muted">
								Precos, volume e variacao de mercado
							</p>
						</div>

						<div className="flex items-center gap-3">
							<div className="wallet-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
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
								className="input input-sm input-bordered"
							/>
						</div>
					</div>

					{isLoading && <p className="wallet-muted">Carregando ativos...</p>}
					{isError && <p className="text-red-400">Erro ao carregar ativos.</p>}

					{!isLoading && !isError && (
						<>
							<div className="wallet-panel hidden overflow-x-auto rounded-lg lg:block">
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
