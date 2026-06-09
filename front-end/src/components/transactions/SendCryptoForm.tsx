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

export default function SendCryptoForm() {
  const { data: wallets = [] } = useWallets();
  const walletId = wallets[0]?.id;
  const { data: portfolio, isLoading, error } = usePortfolio(walletId);
  const { data: assets = [] } = useAssets();
  const portfolioAssets = portfolio?.assets ?? [];
  const { prices } = useMarketStream(portfolioAssets.map((asset) => asset.symbol));
  const { createTransaction } = useTransactions(walletId);

  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);

  const selectedAsset = useMemo(
    () => portfolioAssets.find((asset) => asset.symbol === selectedSymbol),
    [portfolioAssets, selectedSymbol]
  );
  const assetRecord = useMemo(
    () =>
      assets.find(
        (asset) => asset.symbol.toUpperCase() === selectedSymbol.toUpperCase()
      ),
    [assets, selectedSymbol]
  );
  const live = selectedSymbol ? prices[selectedSymbol.toUpperCase()] : undefined;
  const price = live?.price ?? selectedAsset?.current_price ?? assetRecord?.price ?? 0;
  const quantity = safeParse(amount);
  const usdValue = quantity * price;

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!walletId) return toast.error("Crie uma carteira antes de transacionar.");
    if (!selectedAsset || !assetRecord) return toast.error("Selecione um ativo.");
    if (!amount || !address) return toast.error("Preencha todos os campos.");
    if (quantity <= 0) return toast.error("Informe uma quantidade valida.");
    if (quantity > selectedAsset.quantity) return toast.error("Saldo insuficiente.");

    setProcessing(true);
    try {
      await createTransaction.mutateAsync({
        wallet_id: walletId,
        asset_id: assetRecord.id,
        amount: quantity,
        price,
        type: "withdraw",
        tx_hash: address,
        description: "Envio externo",
      });
      toast.success("Envio registrado com sucesso");
      setSelectedSymbol("");
      setAmount("");
      setAddress("");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Erro ao registrar envio");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar!</p>;

  return (
    <form
      onSubmit={handleSend}
      className="flex flex-col gap-4 max-w-md mx-auto bg-base-100/10 p-6 rounded-lg border border-base-300/20"
    >
      <h3 className="text-lg font-semibold text-gray-100 text-center">Enviar Criptoativo</h3>

      <select
        className="select select-bordered bg-base-200 text-gray-100"
        value={selectedSymbol}
        onChange={(event) => {
          setSelectedSymbol(event.target.value);
          setAmount("");
        }}
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
        placeholder="Quantidade a enviar"
        className="input input-bordered bg-base-200 text-gray-100"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        min="0"
        max={selectedAsset?.quantity}
        step="any"
      />

      <input
        type="text"
        placeholder="Endereco de destino ou hash"
        className="input input-bordered bg-base-200 text-gray-100"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />

      {selectedAsset && (
        <div className="text-sm text-gray-300">
          <p>Valor estimado: ${formatCurrency(usdValue)}</p>
          <p className="text-xs text-gray-500">
            Saldo disponivel: {formatNumber(selectedAsset.quantity)} {selectedSymbol}
          </p>
        </div>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={!selectedSymbol || !amount || !address || processing}
      >
        {processing ? "Registrando..." : "Registrar envio"}
      </button>
    </form>
  );
}
