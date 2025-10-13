import LayoutDashboard from "@/components/layout/LayoutDashboard";
import { Header } from "@/components/layout/Header";
import { FooterActions } from "@/components/home/FooterActions";
import { PortfolioDonutChart } from "@/components/home/PortfolioDonutChart";
import { usePortfolioQuery } from "@/hooks/usePortfolioQuery";
import   PortfolioTable   from "@/components/home/PortfolioTable";

export default function Home() {
	const { data: portfolio, isLoading, refetch } = usePortfolioQuery();

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
							<>
								{/* Grid principal: gráfico + lista */}
								<div className="grid grid-cols-1 gap-10 w-full">
									{/* Gráfico principal */}
									<div className="flex flex-col items-center justify-center">
										<PortfolioDonutChart
											total={portfolio.total_balance}
											data={portfolio.assets.map((a) => ({
												name: a.name,
												symbol: a.symbol,
												value_usd: a.value_usd,
												percentage: a.percentage,
											}))}
										/>
									</div>

									{/* Lista de ativos */}
									<div className="">
										<PortfolioTable
											assets={portfolio.assets.map((a) => ({
												...a,
												performance_pct: a.performance_pct ?? 0, // ✅ valor padrão 0
												color: a.color ?? "#8884d8", // valor padrão para color
											}))}
										/>
									</div>
								</div>
							</>
						)
					)}
				</main>

				<FooterActions />
			</LayoutDashboard>
		</div>
	);
}
