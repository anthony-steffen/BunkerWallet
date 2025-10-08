import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
	// Send,
	// ArrowDownToLine,
	// Repeat2,
	RefreshCcw,
	Search,
	LogOut,
	Wallet,
} from "lucide-react";
import api from "../api/api";
import LayoutDashboards from "../components/layout/LayoutDashboard";

interface Asset {
	name: string;
	symbol: string;
	image: string;
	quantity: number;
	current_price: number;
	value_usd: number;
	percentage: number;
}

interface PortfolioSummary {
	total_balance: number;
	assets: Asset[];
}

export default function Home() {
	const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
	const [walletName, setWalletName] = useState<string>("Minha Carteira");
	const [loading, setLoading] = useState(true);

	const COLORS = [
		"#FFD700",
		"#4FD1C5",
		"#9F7AEA",
		"#48BB78",
		"#F56565",
		"#4299E1",
	];

	async function fetchData() {
		try {
			const walletsRes = await api.get("/wallets/");
			if (walletsRes.data.length > 0) {
				const wallet = walletsRes.data[0];
				setWalletName(wallet.name);
				const res = await api.get(`/wallets/${wallet.id}/portfolio`);
				setPortfolio(res.data);
			}
		} catch (error) {
			console.error("Erro ao carregar dados:", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const chartData =
		portfolio?.assets.map((a) => ({
			name: a.symbol,
			value: a.value_usd,
		})) || [];

	return (
		<div className="min-h-screen text-white flex flex-col">
			<LayoutDashboards>
				{/* HEADER */}
				<header className=" flex justify-between items-center p-4 bg-base-100 shadow-md">
					<div className="flex items-center gap-2">
						<Wallet size={20} className="text-yellow-400" />
						<h1 className="text-lg font-bold text-yellow-400">{walletName}</h1>
					</div>

					<div className="flex items-center gap-3">
						{/* Busca */}
						<div className="hidden md:flex items-center bg-base-200 rounded-lg px-3 py-1">
							<Search size={16} className="text-gray-400 mr-2" />
							<input
								type="text"
								placeholder="Buscar..."
								className="bg-transparent outline-none text-sm w-32 md:w-48"
							/>
						</div>

						{/* Atualizar */}
						<button
							className="btn btn-circle btn-ghost hover:bg-base-200"
							onClick={fetchData}
							title="Atualizar">
							<RefreshCcw size={18} />
						</button>

						{/* Logout */}
						<button className="btn btn-circle btn-ghost text-red-500 hover:bg-red-500/10">
							<LogOut size={18} />
						</button>
					</div>
				</header>

				{/* CONTEÚDO */}
				<main className="flex-1 flex flex-col items-center px-4 py-6 shadow-md">
					{loading ? (
						<div className="flex items-center justify-center h-full">
							<span className="loading loading-spinner loading-lg text-primary"></span>
						</div>
					) : (
						<>
							{/* GRÁFICO */}
							<div className="relative w-72 h-72 flex items-center justify-center mt-2">
								<ResponsiveContainer>
									<PieChart>
										<Pie
											data={chartData}
											dataKey="value"
											cx="50%"
											cy="50%"
											innerRadius={90}
											outerRadius={100}
											stroke="none">
											{chartData.length > 0 ? (
												chartData.map((_, i) => (
													<Cell key={i} fill={COLORS[i % COLORS.length]} />
												))
											) : (
												<Cell fill="#ffffff22" />
											)}
										</Pie>
										<Tooltip
											contentStyle={{
												background: "#0f172a",
												border: "none",
												color: "white",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>

								{/* SALDO CENTRAL */}
								<div className="absolute inset-0 flex flex-col items-center justify-center">
									<p className="text-3xl font-bold">
										$
										{portfolio?.total_balance
											? portfolio.total_balance.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})
											: "0.00"}
									</p>
									<p className="text-sm text-gray-400">Saldo total</p>
								</div>
							</div>

							{/* LISTA DE ATIVOS */}
							<div className="mt-6 w-full space-y-3">
								{portfolio?.assets && portfolio.assets.length > 0 ? (
									portfolio.assets.map((asset, idx) => (
										<div
											key={idx}
											className="flex justify-between items-center bg-base-100/10 rounded-xl p-3 hover:bg-base-100/20 transition">
											<div className="flex items-center gap-3">
												<img
													src={asset.image}
													alt={asset.name}
													className="w-8 h-8 rounded-full"
												/>
												<div>
													<p className="font-semibold">{asset.name}</p>
													<p className="text-xs text-gray-400">
														{asset.quantity} {asset.symbol}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-semibold">
													${asset.value_usd.toFixed(2)}
												</p>
												<p className="text-xs text-gray-400">
													${asset.current_price.toFixed(2)}
												</p>
											</div>
										</div>
									))
								) : (
									<p className="text-center text-gray-400 mt-4">
										Nenhum ativo encontrado nesta carteira
									</p>
								)}
							</div>
						</>
					)}
				</main>

				{/* FOOTER */}
				{/* <footer className="bg-base-100/20 p-4 flex justify-around items-center mt-4 rounded-t-2xl backdrop-blur-md shadow-inner">
        <button className="btn btn-circle btn-primary btn-outline">
          <ArrowDownToLine size={22} />
        </button>
        <button className="btn btn-circle btn-primary">
          <Repeat2 size={22} />
        </button>
        <button className="btn btn-circle btn-primary btn-outline">
          <Send size={22} />
        </button>
      </footer> */}
			</LayoutDashboards>
		</div>
	);
}
