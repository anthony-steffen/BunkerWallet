import LayoutDashboard from "@/components/layout/LayoutDashboard";
import { Header } from "@/components/layout/Header";
import { useAssets } from "@/hooks/useAssets";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import { formatCurrency } from "@/utils/format";

export default function Dashboard() {
	const { data: wallets = [], refetch: refetchWallets } = useWallets();
	const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
	const { data: assets = [] } = useAssets();

	const latestTransactions = transactions.slice(0, 5);

	return (
		<LayoutDashboard>
			<Header walletName="Dashboard" onRefresh={refetchWallets} />

			<main className="mx-auto mt-24 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 pb-24 lg:grid-cols-3">
				<section className="wallet-panel rounded-lg p-4">
					<p className="text-sm wallet-muted">Carteiras</p>
					<strong className="text-3xl">{wallets.length}</strong>
				</section>

				<section className="wallet-panel rounded-lg p-4">
					<p className="text-sm wallet-muted">Ativos cadastrados</p>
					<strong className="text-3xl">{assets.length}</strong>
				</section>

				<section className="wallet-panel rounded-lg p-4">
					<p className="text-sm wallet-muted">Transacoes</p>
					<strong className="text-3xl">{transactions.length}</strong>
				</section>

				<section className="wallet-panel rounded-lg p-4 lg:col-span-3">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-lg font-semibold">Ultimas transacoes</h2>
						<span className="text-xs wallet-muted">
							{transactionsLoading ? "Carregando" : "Atualizado"}
						</span>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-base-300 text-left text-xs uppercase wallet-muted">
									<th className="py-2">Tipo</th>
									<th className="py-2">Ativo</th>
									<th className="py-2 text-right">Quantidade</th>
									<th className="py-2 text-right">Total</th>
								</tr>
							</thead>
							<tbody>
								{latestTransactions.map((tx) => (
									<tr key={tx.id} className="border-b border-base-300/70">
										<td className="py-2">{tx.type}</td>
										<td className="py-2">{tx.asset?.symbol ?? tx.asset_id}</td>
										<td className="py-2 text-right">{Number(tx.amount)}</td>
										<td className="py-2 text-right">
											${formatCurrency(Number(tx.amount) * Number(tx.price ?? 0))}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</LayoutDashboard>
	);
}
