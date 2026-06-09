import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency, formatNumber } from "@/utils/format";

const TYPE_LABELS: Record<string, string> = {
  buy: "Compra",
  sell: "Venda",
  deposit: "Deposito",
  withdraw: "Envio",
};

export default function TransactionHistory() {
  const { data: transactions = [], isLoading } = useTransactions();

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-base-300/20 bg-base-100/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historico de Transacoes</h3>
        <span className="text-xs text-gray-500">{transactions.length} registros</span>
      </div>

      {isLoading && <p className="text-sm text-gray-400">Carregando historico...</p>}

      {!isLoading && transactions.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">
          Nenhuma transacao registrada ainda
        </p>
      )}

      {!isLoading && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-base-300/30 text-left text-xs uppercase text-gray-500">
                <th className="py-2">Tipo</th>
                <th className="py-2">Ativo</th>
                <th className="py-2 text-right">Quantidade</th>
                <th className="py-2 text-right">Preco</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2 text-right">Data</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const total = Number(tx.amount) * Number(tx.price ?? 0);
                return (
                  <tr key={tx.id} className="border-b border-base-300/10">
                    <td className="py-2">{TYPE_LABELS[tx.type] ?? tx.type}</td>
                    <td className="py-2">{tx.asset?.symbol ?? tx.asset_id}</td>
                    <td className="py-2 text-right">{formatNumber(Number(tx.amount))}</td>
                    <td className="py-2 text-right">
                      ${formatCurrency(Number(tx.price ?? 0), 4)}
                    </td>
                    <td className="py-2 text-right">${formatCurrency(total)}</td>
                    <td className="py-2 text-right text-xs text-gray-500">
                      {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
