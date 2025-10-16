import React, { useState } from "react";
import TransactionTabs from "@/components/transactions/TransactionTabs";
import BuyCryptoForm from "@/components/transactions/BuyCryptoForm";
import SwapCryptoForm from "@/components/transactions/SwapCryptoForm";
import SendCryptoForm from "@/components/transactions/SendCryptoForm";
import TransactionHistory from "@/components/transactions/TransactionHistory";

export default function Transactions() {
  const [activeTab, setActiveTab] = useState<"buy" | "swap" | "send">("buy");

  return (
    <div className="flex flex-col w-full min-h-screen bg-base-200 text-gray-100 p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Transações</h1>

      {/* Tabs de navegação */}
      <TransactionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* <div className="bg-base-100/10 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-base-300/20 mx-auto"> */}
        {activeTab === "buy" && <BuyCryptoForm />}
        {activeTab === "swap" && <SwapCryptoForm />}
        {activeTab === "send" && <SendCryptoForm />}
      {/* </div> */}

      <div className="mt-12">
        <TransactionHistory />
      </div>
    </div>
  );
}
