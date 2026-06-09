import { ArrowDownUp, Send, TrendingDown, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export type TransactionTab = "buy" | "sell" | "swap" | "send";

interface Props {
  activeTab: TransactionTab;
  setActiveTab: (tab: TransactionTab) => void;
}

export default function TransactionTabs({ activeTab, setActiveTab }: Props) {
  const tabs: Array<{ id: TransactionTab; label: string; icon: ReactNode }> = [
    { id: "buy", label: "Compra", icon: <Wallet size={18} /> },
    { id: "sell", label: "Venda", icon: <TrendingDown size={18} /> },
    { id: "swap", label: "Troca", icon: <ArrowDownUp size={18} /> },
    { id: "send", label: "Envio", icon: <Send size={18} /> },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === tab.id
              ? "bg-yellow-400 text-gray-900 shadow-md"
              : "bg-base-300/70 text-gray-400 hover:bg-base-300/60 hover:text-white"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
