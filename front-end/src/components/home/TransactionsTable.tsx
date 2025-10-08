// src/components/TransactionsTable.tsx
import type { Transaction } from "@/types/Transaction";

type Props = { transactions: Transaction[] | undefined; isLoading?: boolean };

export default function TransactionsTable({ transactions, isLoading }: Props) {
  if (isLoading) return <div>Carregando transações...</div>;
  if (!transactions || transactions.length === 0) return <div>Nenhuma transação.</div>;

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Wallet</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.type}</td>
              <td>{tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : "-"}</td>
              <td>{tx.wallet?.name ?? tx.wallet_id}</td>
              <td className="text-right">{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
