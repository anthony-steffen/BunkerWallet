/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Assets.tsx
import React, { useState } from "react";
import LayoutDashboard from "@/components/layout/LayoutDashboard";
import AssetsTable from "@/components/assets/AssetsTable";
import AssetCard from "@/components/assets/AssetCard";
import { Header } from "@/components/layout/Header";
import { usePortfolio } from "@/hooks/usePortfolio"
import { useTopAssets } from "@/hooks/useAssets";

export default function AssetsPage() {
	const [search] = useState("");
	const { refetch } = usePortfolio();

	const { data: topAssets = [], isLoading, isError } = useTopAssets();

  if (isLoading) return <p>Carregando ativos...</p>;
  if (isError) return <p>Erro ao carregar ativos.</p>;

	const filtered = topAssets.filter(
		(coin: any) =>
			coin.name.toLowerCase().includes(search.toLowerCase()) ||
			coin.symbol.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="min-h-screen text-white flex flex-col">
			<LayoutDashboard>
				<Header walletName="Minha Carteira" onRefresh={refetch} />
				<div className="p-4 lg:w-1/2 mt-20 mx-auto ">
					{/* Desktop */}
					<div className="hidden lg:block">
						<AssetsTable assets={filtered} />
					</div>

					{/* Mobile */}
					<div className="block lg:hidden space-y-4">
						{filtered.map((coin: any) => (
							<AssetCard key={coin.id} coin={coin} />
						))}
					</div>
				</div>
			</LayoutDashboard>
		</div>
	);
}
