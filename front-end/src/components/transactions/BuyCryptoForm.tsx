/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/transactions/BuyCryptoForm.tsx
import React, { useMemo, useState } from "react";
import { useTopAssets } from "@/hooks/useAssets";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "react-toastify";
import TransactionPreviewModal from "./TransactionPreviewModal";
import { safeParse } from "@/utils/math";
import { applyFee } from "@/utils/math";
import { formatCurrency, formatNumber } from "@/utils/format";

export default function BuyCryptoForm() {
  const { data: topAssets = [], isLoading } = useTopAssets();
  const { createTransaction } = useTransactions(1);

  const [symbol, setSymbol] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>(""); // user-controlled
  const [valueInput, setValueInput] = useState<string>(""); // USD user-controlled
  const [feePct, setFeePct] = useState<number | undefined>(undefined); // optional override

  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const selected = useMemo(
    () => topAssets.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase()),
    [symbol, topAssets]
  );
  const price = selected?.current_price ?? 0;

  const qty = safeParse(quantityInput);
  const val = safeParse(valueInput);

  // estimations shown in spans (no auto-fill)
  // if user entered value => show qty they can buy: val / price
  const estimatedQtyFromValue = price > 0 ? val / price : 0;
  // if user entered qty => show total cost
  const estimatedValueFromQty = qty * price;

  applyFee(qty > 0 ? estimatedValueFromQty : val);

  const openPreview = () => {
    if (!symbol) return toast.error("Selecione um ativo");
    if (qty <= 0 && val <= 0) return toast.error("Informe quantidade ou valor.");
    setPreviewOpen(true);
  };

  const onConfirm = async () => {
    // build final quantity and price payload
    const finalQty = qty > 0 ? qty : estimatedQtyFromValue;
    const priceUsd = price;
    const valueUsd = finalQty * priceUsd;
    applyFee(valueUsd, undefined);

    setProcessing(true);
    try {
      await createTransaction.mutateAsync({
        wallet_id: 1,
        symbol,
        quantity: finalQty,
        price_usd: priceUsd,
        type: "buy",
      });
      toast.success("Compra executada com sucesso");
      setSymbol("");
      setQuantityInput("");
      setValueInput("");
      setPreviewOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erro ao criar transação");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          openPreview();
        }}
        className="flex flex-col gap-4 max-w-md mx-auto bg-base-100/10 p-6 rounded-2xl border border-base-300/20"
      >
        <h2 className="text-lg font-semibold text-gray-100 text-center">Comprar Cripto</h2>

        <select
          className="select select-bordered bg-base-200 text-gray-100"
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value);
            setQuantityInput("");
            setValueInput("");
          }}
          disabled={isLoading}
        >
          <option value="">Selecione o ativo</option>
          {topAssets.map((t) => (
            <option key={t.id} value={t.symbol.toUpperCase()}>
              {t.name} ({t.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          className="input input-bordered bg-base-200 text-gray-100"
          value={quantityInput}
          onChange={(e) => setQuantityInput(e.target.value)}
          min="0"
          step="any"
          disabled={!symbol}
        />

        <input
          type="number"
          placeholder="Valor total (USD)"
          className="input input-bordered bg-base-200 text-gray-100"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          min="0"
          step="any"
          disabled={!symbol}
        />

        <div className="text-sm text-gray-300 space-y-1">
          {valueInput && price > 0 && (
            <div>
              <span className="text-gray-400">Você pode comprar:</span>{" "}
              <span className="font-semibold text-yellow-400">
                {formatNumber(estimatedQtyFromValue)}
                {" "}
                {symbol}
              </span>
            </div>
          )}

          {quantityInput && (
            <div>
              <span className="text-gray-400">Valor a pagar:</span>{" "}
              <span className="font-semibold text-cyan-400">
                ${formatCurrency(estimatedValueFromQty)}
              </span>
            </div>
          )}

          {symbol && price > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Preço atual: 1 {symbol} = ${formatCurrency(price, 4)}
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-xs text-gray-400">Fee (%)</label>
          <input
            type="number"
            className="input input-sm input-bordered w-24 bg-base-200 text-gray-100"
            value={feePct ?? ""}
            onChange={(e) => setFeePct(e.target.value ? Number(e.target.value) / 100 : undefined)}
            placeholder={`${(0.25).toFixed(2)}%`}
            step="any"
          />
          <small className="text-xs text-gray-500">opcional (ex: 0.25 para 0.25%)</small>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn bg-gradient-to-r from-yellow-400 to-cyan-400 text-black" disabled={!symbol}>
            Pré-visualizar
          </button>
        </div>
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
          valueUsd: qty > 0 ? estimatedValueFromQty : val,
          fee: applyFee(qty > 0 ? estimatedValueFromQty : val).fee,
          netUsd: applyFee(qty > 0 ? estimatedValueFromQty : val).net,
        }}
      />
    </>
  );
}
