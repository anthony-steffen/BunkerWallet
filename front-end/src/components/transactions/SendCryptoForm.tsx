/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/transactions/SendCryptoForm.tsx
import React, { useMemo, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTransactions } from "@/hooks/useTransactions";
import { safeParse, applyFee } from "@/utils/math";
import { formatCurrency, formatNumber } from "@/utils/format";
import TransactionPreviewModal from "./TransactionPreviewModal";
import { toast } from "react-toastify";
export default function SendCryptoForm() {
  const { data: portfolio = [] } = usePortfolio(1);
  const { createTransaction } = useTransactions(1);

  const [symbol, setSymbol] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>("");
  const [valueInput, setValueInput] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const selected = useMemo(() => portfolio.find(p => p.symbol.toUpperCase() === symbol.toUpperCase()), [symbol, portfolio]);
  const price = selected?.current_price ?? 0;
  const balance = selected?.quantity ?? 0;

  const qty = safeParse(quantityInput);
  const val = safeParse(valueInput);

  const estimatedQtyFromValue = price > 0 ? val / price : 0;
  const estimatedValueFromQty = qty * price;

  const willSendQty = qty > 0 ? qty : estimatedQtyFromValue;

  const openPreview = () => {
    if (!symbol) return toast.error("Selecione um ativo");
    if (!address) return toast.error("Informe o endereço");
    if (willSendQty <= 0) return toast.error("Informe quantidade ou valor válido");
    if (willSendQty > balance) return toast.error("Saldo insuficiente");
    setPreviewOpen(true);
  };

  const onConfirm = async () => {
    setProcessing(true);
    try {
      await createTransaction.mutateAsync({
        wallet_id: 1,
        symbol,
        quantity: -willSendQty,
        price_usd: price,
        type: "send",
      });
      toast.success("Envio registrado");
      setSymbol(""); setAddress(""); setQuantityInput(""); setValueInput("");
      setPreviewOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erro ao enviar");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); openPreview(); }} className="flex flex-col gap-4 max-w-md mx-auto bg-base-100/10 p-6 rounded-2xl border border-base-300/20">
        <h2 className="text-lg font-semibold text-gray-100 text-center">Enviar Cripto</h2>

        <select value={symbol} onChange={(e) => { setSymbol(e.target.value); setQuantityInput(""); setValueInput(""); }} className="select select-bordered bg-base-200 text-gray-100">
          <option value="">Selecione o ativo</option>
          {portfolio.map((p: any) => (<option key={p.symbol} value={p.symbol}>{p.name} ({p.symbol})</option>))}
        </select>

        <input type="text" placeholder="Endereço de destino" className="input input-bordered bg-base-200 text-gray-100" value={address} onChange={(e) => setAddress(e.target.value)} disabled={!symbol} />

        <input type="number" placeholder="Quantidade" className="input input-bordered bg-base-200 text-gray-100" value={quantityInput} onChange={(e) => setQuantityInput(e.target.value)} min="0" step="any" disabled={!symbol} />

        <input type="number" placeholder="Valor total (USD)" className="input input-bordered bg-base-200 text-gray-100" value={valueInput} onChange={(e) => setValueInput(e.target.value)} min="0" step="any" disabled={!symbol} />

        <div className="text-sm text-gray-300 space-y-1">
          {valueInput && price > 0 && (
            <div>
              <span className="text-gray-400">Quantidade estimada:</span>{" "}
              <span className="font-semibold text-yellow-400">{formatNumber(estimatedQtyFromValue)} {symbol}</span>
            </div>
          )}
          {quantityInput && (
            <div>
              <span className="text-gray-400">Valor estimado (USD):</span>{" "}
              <span className="font-semibold text-cyan-400">${formatCurrency(estimatedValueFromQty)}</span>
            </div>
          )}
          {symbol && <div className="text-xs text-gray-500">Saldo disponível: {formatNumber(balance, 6)} {symbol}</div>}
        </div>

        <div className="flex justify-end">
          <button className="btn bg-gradient-to-r from-yellow-400 to-cyan-400 text-black" disabled={!symbol || !address}>Pré-visualizar</button>
        </div>
      </form>

      <TransactionPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        processing={processing}
        onConfirm={onConfirm}
        title="Confirmar envio"
        payload={{
          typeLabel: "Enviar",
          symbol,
          quantity: willSendQty,
          priceUsd: price,
          valueUsd: willSendQty * price,
          fee: applyFee(willSendQty * price).fee,
          netUsd: applyFee(willSendQty * price).net,
        }}
      />
    </>
  );
}
