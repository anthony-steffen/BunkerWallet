import { useState } from "react";
import TransactionTabs from "@/components/transactions/TransactionTabs";
import type { TransactionTab } from "@/components/transactions/TransactionTabs";
import BuyCryptoForm from "@/components/transactions/BuyCryptoForm";
import SellCryptoForm from "@/components/transactions/SellCryptoForm";
import SwapCryptoForm from "@/components/transactions/SwapCryptoForm";
import SendCryptoForm from "@/components/transactions/SendCryptoForm";
import TransactionHistory from "@/components/transactions/TransactionHistory";

export default function Transactions() {
  const [activeTab, setActiveTab] = useState<TransactionTab>("buy");

  return (
    <div className="flex min-h-screen w-full flex-col bg-base-200 p-6 text-gray-100 lg:p-10">
      <h1 className="mb-6 text-center text-3xl font-bold text-yellow-400">
        Transacoes
      </h1>

      <TransactionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6">
        {activeTab === "buy" && <BuyCryptoForm />}
        {activeTab === "sell" && <SellCryptoForm />}
        {activeTab === "swap" && <SwapCryptoForm />}
        {activeTab === "send" && <SendCryptoForm />}
      </div>

      <div className="mt-12">
        <TransactionHistory />
      </div>
    </div>
  );
}
