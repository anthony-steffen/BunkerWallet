import type { Wallet } from "@/types/Wallet";

type Props = { wallets: Wallet[] | undefined; total?: number };

export default function WalletSummary({ wallets }: Props) {
  const total = wallets?.length ? wallets.length : 0;

  return (
    <div className="wallet-panel rounded-lg p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Wallets</h2>
          <p className="text-sm wallet-muted">Voce tem {total} carteira(s)</p>
        </div>
        <button className="btn btn-primary">Create Wallet</button>
      </div>
    </div>
  );
}
