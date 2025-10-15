import React from "react";
import { Wallet, RefreshCcw, Send } from "lucide-react";

interface Props {
  activeTab: "buy" | "swap" | "send";
  setActiveTab: (tab: "buy" | "swap" | "send") => void;
}

const TransactionTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "buy", label: "Buy", icon: <Wallet size={18} /> },
    { id: "swap", label: "Swap", icon: <RefreshCcw size={18} /> },
    { id: "send", label: "Send", icon: <Send size={18} /> },
  ];

  return (
    <div className="flex justify-center gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as "buy" | "swap" | "send")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium
            ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-yellow-400 to-cyan-400 text-black shadow-md"
                : "bg-base-300/40 text-gray-400 hover:text-white hover:bg-base-300/60"
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TransactionTabs;
