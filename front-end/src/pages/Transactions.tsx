import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import LayoutDashboard from "@/components/layout/LayoutDashboard";
import BuyCryptoForm from "@/components/transactions/BuyCryptoForm";
import SellCryptoForm from "@/components/transactions/SellCryptoForm";
import SendCryptoForm from "@/components/transactions/SendCryptoForm";
import SwapCryptoForm from "@/components/transactions/SwapCryptoForm";
import TransactionHistory from "@/components/transactions/TransactionHistory";
import TransactionTabs from "@/components/transactions/TransactionTabs";
import type { TransactionTab } from "@/components/transactions/TransactionTabs";

const VALID_TABS: TransactionTab[] = ["buy", "sell", "swap", "send"];

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") as TransactionTab | null;
  const initialTab = VALID_TABS.includes(requestedTab ?? "buy")
    ? requestedTab ?? "buy"
    : "buy";
  const [activeTab, setActiveTab] = useState<TransactionTab>(initialTab);

  useEffect(() => {
    if (requestedTab && VALID_TABS.includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const handleTabChange = (tab: TransactionTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const title = useMemo(() => {
    const labels: Record<TransactionTab, string> = {
      buy: "Comprar criptoativo",
      sell: "Vender posicao",
      swap: "Trocar ativos",
      send: "Enviar criptoativo",
    };
    return labels[activeTab];
  }, [activeTab]);

  return (
    <LayoutDashboard>
      <Header walletName="Transacoes" />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 lg:px-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-base-content/60">
            Registre compras, vendas, trocas e envios usando precos atualizados em tempo real.
          </p>
        </div>

        <section className="wallet-panel rounded-lg p-4 lg:p-6">
          <TransactionTabs activeTab={activeTab} setActiveTab={handleTabChange} />

          <div className="mt-6">
            {activeTab === "buy" && <BuyCryptoForm />}
            {activeTab === "sell" && <SellCryptoForm />}
            {activeTab === "swap" && <SwapCryptoForm />}
            {activeTab === "send" && <SendCryptoForm />}
          </div>
        </section>

        <section className="mt-6">
          <TransactionHistory />
        </section>
      </main>
    </LayoutDashboard>
  );
}
