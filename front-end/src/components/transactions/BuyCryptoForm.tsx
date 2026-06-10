/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAssets } from "@/hooks/useAssets";
import { useMarketStream } from "@/hooks/useMarket";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import TransactionPreviewModal from "./TransactionPreviewModal";
import { applyFee, safeParse } from "@/utils/math";
import { formatCurrency, formatNumber } from "@/utils/format";

export default function BuyCryptoForm() {
  const { data: wallets = [] } = useWallets();
  const walletId = wallets[0]?.id;
  const { data: assets = [], isLoading } = useAssets();
  const { createTransaction } = useTransactions(walletId);

  const [assetId, setAssetId] = useState<number | "">("");
  const [quantityInput, setQuantityInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [feePct, setFeePct] = useState<number | undefined>(undefined);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const selected = useMemo(
    () => assets.find((asset) => asset.id === Number(assetId)),
    [assetId, assets]
  );
  const selectedSymbol = selected?.symbol.toUpperCase() ?? "";
  const { prices } = useMarketStream(selectedSymbol ? [selectedSymbol] : []);
  const live = selectedSymbol ? prices[selectedSymbol] : undefined;
  const price = live?.price ?? selected?.price ?? 0;
  const symbol = selectedSymbol;

  const qty = safeParse(quantityInput);
  const val = safeParse(valueInput);
  const estimatedQtyFromValue = price > 0 ? val / price : 0;
  const estimatedValueFromQty = qty * price;
  const orderValue = qty > 0 ? estimatedValueFromQty : val;
  const fee = applyFee(orderValue, feePct);

  const openPreview = () => {
    if (!walletId) return toast.error("Crie uma carteira antes de transacionar.");
    if (!selected) return toast.error("Selecione um ativo.");
    if (qty <= 0 && val <= 0) return toast.error("Informe quantidade ou valor.");
    if (price <= 0) return toast.error("Preco indisponivel para este ativo.");
    setPreviewOpen(true);
  };

  const onConfirm = async () => {
    if (!walletId || !selected) return;

    const finalQty = qty > 0 ? qty : estimatedQtyFromValue;
    setProcessing(true);
    try {
      await createTransaction.mutateAsync({
        wallet_id: walletId,
        asset_id: selected.id,
        amount: finalQty,
        price,
        type: "buy",
      });
      toast.success("Compra registrada com sucesso");
      setAssetId("");
      setQuantityInput("");
      setValueInput("");
      setPreviewOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Erro ao criar transacao");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          openPreview();
        }}
        className="wallet-form mx-auto flex max-w-md flex-col gap-4 rounded-lg p-6"
      >
        <h2 className="text-center text-lg font-semibold">Comprar Cripto</h2>

        <select
          className="select select-bordered"
          value={assetId}
          onChange={(event) => {
            setAssetId(event.target.value ? Number(event.target.value) : "");
            setQuantityInput("");
            setValueInput("");
          }}
          disabled={isLoading}
        >
          <option value="">Selecione o ativo</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name} ({asset.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          className="input input-bordered"
          value={quantityInput}
          onChange={(event) => setQuantityInput(event.target.value)}
          min="0"
          step="any"
          disabled={!selected}
        />

        <input
          type="number"
          placeholder="Valor total (USD)"
          className="input input-bordered"
          value={valueInput}
          onChange={(event) => setValueInput(event.target.value)}
          min="0"
          step="any"
          disabled={!selected}
        />

        <div className="space-y-1 text-sm wallet-muted">
          {valueInput && price > 0 && (
            <div>
              <span>Voce pode comprar:</span>{" "}
              <span className="font-semibold text-yellow-400">
                {formatNumber(estimatedQtyFromValue)} {symbol}
              </span>
            </div>
          )}

          {quantityInput && (
            <div>
              <span>Valor a pagar:</span>{" "}
              <span className="font-semibold text-cyan-400">
                ${formatCurrency(estimatedValueFromQty)}
              </span>
            </div>
          )}

          {selected && price > 0 && (
            <div className="mt-1 text-xs wallet-muted">
              Preco atual: 1 {symbol} = ${formatCurrency(price, 4)}
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-xs wallet-muted">Fee (%)</label>
          <input
            type="number"
            className="input input-sm input-bordered w-24"
            value={feePct ? feePct * 100 : ""}
            onChange={(event) =>
              setFeePct(event.target.value ? Number(event.target.value) / 100 : undefined)
            }
            placeholder="0.25"
            step="any"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selected}
        >
          Pre-visualizar
        </button>
      </form>

      <TransactionPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        processing={processing}
        onConfirm={onConfirm}
        title="Confirmar compra"
        payload={{
          typeLabel: "Compra",
          symbol,
          quantity: qty > 0 ? qty : estimatedQtyFromValue,
          priceUsd: price,
          valueUsd: orderValue,
          fee: fee.fee,
          netUsd: fee.net,
        }}
      />
    </>
  );
}
