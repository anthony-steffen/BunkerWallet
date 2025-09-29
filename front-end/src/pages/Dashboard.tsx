import LayoutDashboards from "@/components/Dashboard/LayoutDashboard";
import WalletSummary from "@/components/Dashboard/WalletSummary";
import TransactionsTable from "@/components/Dashboard/TransactionsTable";
import AssetsList from "@/components/Dashboard/AssetsList";

import { useWallets } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import { useAssets } from "@/hooks/useAssets";

export default function Dashboard() {
  const { data: wallets, isLoading: wLoading } = useWallets();
  const { data: transactions, isLoading: tLoading } = useTransactions();
  const { data: assets, isLoading: aLoading } = useAssets();

  return (
    <LayoutDashboards>
      {/* Grid superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <WalletSummary wallets={wallets} />
        </div>
        <div>
          <AssetsList assets={assets} />
        </div>
      </div>

      {/* Grid inferior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionsTable
            transactions={transactions}
            isLoading={tLoading || aLoading || wLoading}
          />
        </div>
        <div>
          {/* Widgets extras */}
          <div className="bg-base-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <button className="btn btn-outline btn-block">Nova transação</button>
              <button className="btn btn-outline btn-block">Importar carteira</button>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboards>
  );
}
