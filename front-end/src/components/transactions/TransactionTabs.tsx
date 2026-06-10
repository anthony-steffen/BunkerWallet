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
    <div className="flex flex-wrap justify-center gap-2 rounded-lg bg-base-200/70 p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === tab.id
              ? "bg-primary text-primary-content shadow-sm"
              : "text-base-content/60 hover:bg-base-100 hover:text-base-content"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
