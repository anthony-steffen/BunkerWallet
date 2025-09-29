// src/components/WalletSummary.tsx
import type { Wallet } from "@/types/Wallet";

type Props = { wallets: Wallet[] | undefined; total?: number };

export default function WalletSummary({ wallets }: Props) {
  const total = wallets?.length ? wallets.length : 0; // substitua por soma de saldos se tiver campo
  return (
    <div className="p-6 bg-base-100 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Wallets</h2>
          <p className="text-sm text-gray-400">Você tem {total} carteira(s)</p>
        </div>
        <button className="btn btn-warning">Create Wallet</button>
      </div>
    </div>
  );
}
