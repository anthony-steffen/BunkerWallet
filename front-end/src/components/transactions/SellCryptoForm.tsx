/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
import { useAssets } from "@/hooks/useAssets";
import { useMarketStream } from "@/hooks/useMarket";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import { formatCurrency, formatNumber } from "@/utils/format";
import { safeParse } from "@/utils/math";

export default function SellCryptoForm() {
  const { data: wallets = [] } = useWallets();
  const walletId = wallets[0]?.id;
  const { data: portfolio } = usePortfolio(walletId);
  const { data: assets = [] } = useAssets();
  const portfolioAssets = useMemo(() => portfolio?.assets ?? [], [portfolio?.assets]);
  const { prices } = useMarketStream(portfolioAssets.map((asset) => asset.symbol));
  const { createTransaction } = useTransactions(walletId);

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [processing, setProcessing] = useState(false);

  const selectedHolding = useMemo(
    () => portfolioAssets.find((asset) => asset.symbol === symbol),
    [portfolioAssets, symbol]
  );
  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.symbol.toUpperCase() === symbol.toUpperCase()),
    [assets, symbol]
  );
  const live = symbol ? prices[symbol.toUpperCase()] : undefined;
  const price = live?.price ?? selectedHolding?.current_price ?? selectedAsset?.price ?? 0;
  const amount = safeParse(quantity);
  const valueUsd = amount * price;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!walletId) return toast.error("Crie uma carteira antes de transacionar.");
    if (!selectedHolding || !selectedAsset) return toast.error("Selecione um ativo.");
    if (amount <= 0) return toast.error("Informe uma quantidade valida.");
    if (amount > selectedHolding.quantity) return toast.error("Saldo insuficiente.");

    setProcessing(true);
    try {
      await createTransaction.mutateAsync({
        wallet_id: walletId,
        asset_id: selectedAsset.id,
        amount,
        price,
        type: "sell",
      });
      toast.success("Venda registrada com sucesso");
      setSymbol("");
      setQuantity("");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Erro ao registrar venda");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto bg-base-100/10 p-6 rounded-lg border border-base-300/20"
    >
      <h2 className="text-lg font-semibold text-gray-100 text-center">Vender Cripto</h2>

      <select
        value={symbol}
        onChange={(event) => {
          setSymbol(event.target.value);
          setQuantity("");
        }}
        className="select select-bordered bg-base-200 text-gray-100"
      >
        <option value="">Selecione o ativo</option>
        {portfolioAssets.map((asset) => (
          <option key={asset.symbol} value={asset.symbol}>
            {asset.name} ({asset.symbol}) - {formatNumber(asset.quantity)}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantidade"
        className="input input-bordered bg-base-200 text-gray-100"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        min="0"
        max={selectedHolding?.quantity}
        step="any"
        disabled={!selectedHolding}
      />

      {selectedHolding && (
        <div className="text-sm text-gray-300">
          <p>Preco atual: ${formatCurrency(price, 4)}</p>
          <p>Valor estimado: ${formatCurrency(valueUsd)}</p>
          <p className="text-xs text-gray-500">
            Saldo disponivel: {formatNumber(selectedHolding.quantity)} {symbol}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-warning text-black"
        disabled={!selectedHolding || processing}
      >
        {processing ? "Registrando..." : "Registrar venda"}
      </button>
    </form>
  );
}
