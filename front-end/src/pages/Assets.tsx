/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Assets.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LayoutDashboard from "@/components/layout/LayoutDashboard";
import AssetsTable from "@/components/assets/AssetsTable";
import AssetCard from "@/components/assets/AssetCard";
import { Header } from "@/components/layout/Header";
import { usePortfolioQuery } from "@/hooks/usePortfolioQuery";

export default function AssetsPage() {
	const [search] = useState("");
	const { refetch } = usePortfolioQuery();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["topAssets"],
		queryFn: async () => {
			const res = await axios.get(
				"https://api.coingecko.com/api/v3/coins/markets",
				{
					params: {
						vs_currency: "usd",
						order: "market_cap_desc",
						per_page: 100,
						page: 1,
						sparkline: true,
					},
				}
			);
			return res.data;
		},
		staleTime: 1000 * 60, // 1 min
	});

	if (isLoading)
		return <div className="text-center text-gray-400">Carregando...</div>;

	if (isError || !data)
		return (
			<div className="text-center text-red-400">
				Erro ao carregar dados. Tente novamente.
			</div>
		);

	const filtered = data.filter(
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
