import React from "react";

export default function TransactionHistory() {
  const fakeHistory = [
    { id: 1, type: "Compra", asset: "BTC", amount: "0.01", value: 680 },
    { id: 2, type: "Troca", asset: "ETH → SOL", amount: "2", value: 500 },
    { id: 3, type: "Envio", asset: "BNB", amount: "0.5", value: 320 },
  ];

  return (
    <div className="bg-base-100/10 rounded-xl p-4 border border-base-300/20">
      <h3 className="text-lg font-semibold mb-3">Histórico de Transações</h3>
      <ul className="divide-y divide-base-300/30">
        {fakeHistory.map((tx) => (
          <li
            key={tx.id}
            className="flex justify-between py-2 text-sm text-gray-300"
          >
            <span>{tx.type}</span>
            <span>{tx.asset}</span>
            <span>{tx.amount}</span>
            <span>${tx.value.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
