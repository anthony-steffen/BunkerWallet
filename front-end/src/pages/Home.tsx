import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
	RefreshCcw,
	Search,
	Send,
	ArrowDownToLine,
	Repeat2,
} from "lucide-react";
import api from "../api/api";

interface ChartDataInput {
	name: string;
	value: number;
	[key: string]: string | number;
}

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
	const [walletName, setWalletName] = useState<string>("");
	const [loading, setLoading] = useState(true);

	const chartData: ChartDataInput[] =
		portfolio?.assets.map((a) => ({
			name: a.symbol,
			value: a.value_usd,
		})) || [];

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

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-base-200">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white flex flex-col">
			{/* HEADER */}
			<header className="flex justify-between items-center p-4">
				<h1 className="text-lg font-bold">{walletName || "Minha Carteira"}</h1>
				<div className="flex items-center gap-3">
					<button className="btn btn-circle btn-ghost">
						<Search size={20} />
					</button>
					<button className="btn btn-circle btn-ghost" onClick={fetchData}>
						<RefreshCcw size={20} />
					</button>
				</div>
			</header>

			{/* MAIN */}
			<main className="flex-1 flex flex-col items-center px-4">
				{/* BALANCE CIRCLE */}
				<div className="relative w-full flex flex-col items-center mt-4">
					<div className="w-64 h-64">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={chartData}
									dataKey="value"
									cx="50%"
									cy="50%"
									innerRadius={80}
									outerRadius={100}
									stroke="none">
									{chartData.map((_, i) => (
										<Cell key={i} fill={COLORS[i % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{ background: "#0f172a", border: "none" }}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>

					{/* BALANCE LABEL */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<p className="text-2xl font-bold">
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
									<p className="font-semibold">${asset.value_usd.toFixed(2)}</p>
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
			</main>

			{/* FOOTER */}
			<footer className="bg-base-100/20 p-4 flex justify-around items-center mt-4 rounded-t-2xl backdrop-blur-md">
				<button className="btn btn-circle btn-primary btn-outline">
					<ArrowDownToLine size={22} />
				</button>
				<button className="btn btn-circle btn-primary">
					<Repeat2 size={22} />
				</button>
				<button className="btn btn-circle btn-primary btn-outline">
					<Send size={22} />
				</button>
			</footer>
		</div>
	);
}
