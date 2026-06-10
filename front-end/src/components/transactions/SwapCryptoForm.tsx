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

export default function SwapCryptoForm() {
  const { data: wallets = [] } = useWallets();
  const walletId = wallets[0]?.id;
  const { data: portfolio } = usePortfolio(walletId);
  const { data: assets = [] } = useAssets();
  const portfolioAssets = useMemo(() => portfolio?.assets ?? [], [portfolio?.assets]);
  const { createSwap } = useTransactions(walletId);

  const [fromSymbol, setFromSymbol] = useState("");
  const [toAssetId, setToAssetId] = useState<number | "">("");
  const [quantity, setQuantity] = useState("");
  const [processing, setProcessing] = useState(false);

  const fromHolding = useMemo(
    () => portfolioAssets.find((asset) => asset.symbol === fromSymbol),
    [fromSymbol, portfolioAssets]
  );
  const fromAsset = useMemo(
    () => assets.find((asset) => asset.symbol.toUpperCase() === fromSymbol.toUpperCase()),
    [assets, fromSymbol]
  );
  const toAsset = useMemo(
    () => assets.find((asset) => asset.id === Number(toAssetId)),
    [assets, toAssetId]
  );
  const streamSymbols = useMemo(
    () => [fromSymbol, toAsset?.symbol ?? ""].filter(Boolean),
    [fromSymbol, toAsset?.symbol]
  );
  const { prices } = useMarketStream(streamSymbols);

  const fromLive = fromSymbol ? prices[fromSymbol.toUpperCase()] : undefined;
  const toLive = toAsset ? prices[toAsset.symbol.toUpperCase()] : undefined;
  const fromPrice = fromLive?.price ?? fromHolding?.current_price ?? fromAsset?.price ?? 0;
  const toPrice = toLive?.price ?? toAsset?.price ?? 0;
  const fromAmount = safeParse(quantity);
  const grossUsd = fromAmount * fromPrice;
  const estimatedToAmount = toPrice > 0 ? grossUsd / toPrice : 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!walletId) return toast.error("Crie uma carteira antes de transacionar.");
    if (!fromHolding || !fromAsset || !toAsset) return toast.error("Selecione os ativos.");
    if (fromAsset.id === toAsset.id) return toast.error("Escolha ativos diferentes.");
    if (fromAmount <= 0) return toast.error("Informe uma quantidade valida.");
    if (fromAmount > fromHolding.quantity) return toast.error("Saldo insuficiente.");
    if (fromPrice <= 0 || toPrice <= 0) return toast.error("Preco indisponivel.");

    setProcessing(true);
    try {
      await createSwap.mutateAsync({
        wallet_id: walletId,
        from_asset_id: fromAsset.id,
        to_asset_id: toAsset.id,
        from_amount: fromAmount,
        from_price: fromPrice,
        to_amount: estimatedToAmount,
        to_price: toPrice,
        description: `Troca ${fromAsset.symbol} -> ${toAsset.symbol}`,
      });
      toast.success("Troca registrada com sucesso");
      setFromSymbol("");
      setToAssetId("");
      setQuantity("");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Erro ao registrar troca");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="wallet-form mx-auto flex max-w-lg flex-col gap-4 rounded-lg p-6"
    >
      <h2 className="text-center text-lg font-semibold">Trocar Cripto</h2>

      <label className="text-sm wallet-muted">De</label>
      <select
        value={fromSymbol}
        onChange={(event) => {
          setFromSymbol(event.target.value);
          setQuantity("");
        }}
        className="select select-bordered"
      >
        <option value="">Selecione ativo de origem</option>
        {portfolioAssets.map((asset) => (
          <option key={asset.symbol} value={asset.symbol}>
            {asset.name} ({asset.symbol}) - {formatNumber(asset.quantity)}
          </option>
        ))}
      </select>

      <label className="text-sm wallet-muted">Para</label>
      <select
        value={toAssetId}
        onChange={(event) => setToAssetId(event.target.value ? Number(event.target.value) : "")}
        className="select select-bordered"
      >
        <option value="">Selecione ativo de destino</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.name} ({asset.symbol.toUpperCase()})
          </option>
        ))}
      </select>

      <input
        type="number"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        placeholder="Quantidade de origem"
        className="input input-bordered"
        min="0"
        max={fromHolding?.quantity}
        step="any"
        disabled={!fromHolding}
      />

      {fromHolding && toAsset && (
        <div className="wallet-soft rounded-lg p-3 text-sm">
          <p>
            {formatNumber(fromAmount)} {fromSymbol} = $
            {formatCurrency(grossUsd)}
          </p>
          <p>
            Recebimento estimado: {formatNumber(estimatedToAmount)}{" "}
            {toAsset.symbol.toUpperCase()}
          </p>
          <p className="text-xs wallet-muted">
            1 {fromSymbol} = ${formatCurrency(fromPrice, 4)} | 1{" "}
            {toAsset.symbol.toUpperCase()} = ${formatCurrency(toPrice, 4)}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!fromHolding || !toAsset || processing}
      >
        {processing ? "Registrando..." : "Registrar troca"}
      </button>
    </form>
  );
}
