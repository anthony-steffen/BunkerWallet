/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/transactions/SwapCryptoForm.tsx
import React, { useMemo, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTopAssets } from "@/hooks/useAssets";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionPreviewModal from "./TransactionPreviewModal";
import { safeParse, applyFee } from "@/utils/math";
import { formatCurrency, formatNumber } from "@/utils/format";
import { toast } from "react-toastify";

export default function SwapCryptoForm() {
  const { data: portfolio = [] } = usePortfolio();
  const { data: topAssets = [] } = useTopAssets();
  const { createTransaction } = useTransactions(1);

  const [fromSymbol, setFromSymbol] = useState<string>("");
  const [toSymbol, setToSymbol] = useState<string>("");
  const [fromQtyInput, setFromQtyInput] = useState<string>("");
  const [usdInput, setUsdInput] = useState<string>(""); // optional: user specifies USD to spend
  const [previewOpen, setPreviewOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fromAsset = useMemo(() => portfolio.find(p => p.symbol.toUpperCase() === fromSymbol.toUpperCase()), [fromSymbol, portfolio]);
  const toAsset = useMemo(() => topAssets.find(t => t.symbol.toUpperCase() === toSymbol.toUpperCase()), [toSymbol, topAssets]);

  const fromPrice = fromAsset?.current_price ?? 0;
  const toPrice = toAsset?.current_price ?? 0;

  const parsedFromQty = safeParse(fromQtyInput);
  const parsedUsd = safeParse(usdInput);

  // If user entered USD -> estimated toQuantity = USD / toPrice
  const estimatedToQtyFromUsd = toPrice > 0 ? parsedUsd / toPrice : 0;

  // If user entered fromQuantity -> USD value = fromQty * fromPrice; toQty = USD / toPrice
  const usdFromFromQty = parsedFromQty * fromPrice;
  const estimatedToQtyFromQty = toPrice > 0 ? usdFromFromQty / toPrice : 0;

  // validation: cannot swap more than available in portfolio
  const availableQty = fromAsset?.quantity ?? 0;
  const willSpendQty = parsedFromQty > 0 ? parsedFromQty : (parsedUsd > 0 && fromPrice > 0 ? parsedUsd / fromPrice : 0);

  const openPreview = () => {
    if (!fromSymbol || !toSymbol) return toast.error("Selecione os ativos de origem e destino.");
    if (willSpendQty <= 0) return toast.error("Informe quantidade ou valor válido.");
    if (willSpendQty > availableQty) return toast.error("Saldo insuficiente.");
    setPreviewOpen(true);
  };

  const onConfirm = async () => {
    setProcessing(true);
    try {
      // finalize quantities: fromQty is willSpendQty; toQty estimated
      const finalFromQty = willSpendQty;
      const finalToQty = parsedFromQty > 0 ? estimatedToQtyFromQty : estimatedToQtyFromUsd;
      // create sell (from) and buy (to)
      await createTransaction.mutateAsync({
        wallet_id: 1,
        symbol: fromSymbol,
        quantity: -finalFromQty,
        price_usd: fromPrice,
        type: "swap",
      });
      await createTransaction.mutateAsync({
        wallet_id: 1,
        symbol: toSymbol,
        quantity: finalToQty,
        price_usd: toPrice,
        type: "swap",
      });
      toast.success(`Swap ${fromSymbol} → ${toSymbol} realizado`);
      setFromSymbol(""); setToSymbol(""); setFromQtyInput(""); setUsdInput("");
      setPreviewOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erro ao executar swap");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); openPreview(); }} className="flex flex-col gap-4 max-w-md mx-auto bg-base-100/10 p-6 rounded-2xl border border-base-300/20">
        <h2 className="text-lg font-semibold text-gray-100 text-center">Trocar Cripto</h2>

        <select value={fromSymbol} onChange={(e) => { setFromSymbol(e.target.value); setFromQtyInput(""); setUsdInput(""); }} className="select select-bordered bg-base-200 text-gray-100">
          <option value="">Ativo de origem</option>
          {portfolio.map((p: any) => (
            <option key={p.symbol} value={p.symbol}>{p.name} ({p.symbol})</option>
          ))}
        </select>

        <select value={toSymbol} onChange={(e) => { setToSymbol(e.target.value); setFromQtyInput(""); setUsdInput(""); }} className="select select-bordered bg-base-200 text-gray-100">
          <option value="">Ativo de destino</option>
          {topAssets.map((t: any) => (
            <option key={t.id} value={t.symbol.toUpperCase()}>{t.name} ({t.symbol.toUpperCase()})</option>
          ))}
        </select>

        <input type="number" placeholder="Quantidade (origem)" className="input input-bordered bg-base-200 text-gray-100" value={fromQtyInput} onChange={(e) => setFromQtyInput(e.target.value)} disabled={!fromSymbol || !toSymbol} min="0" step="any" />

        <input type="number" placeholder="Valor em USD (opcional)" className="input input-bordered bg-base-200 text-gray-100" value={usdInput} onChange={(e) => setUsdInput(e.target.value)} disabled={!fromSymbol || !toSymbol} min="0" step="any" />

        <div className="text-sm text-gray-300 space-y-1">
          {usdInput && toPrice > 0 && (
            <div>
              <span className="text-gray-400">Receberá (estimado):</span>{" "}
              <span className="font-semibold text-cyan-400">{formatNumber(estimatedToQtyFromUsd)} {toSymbol}</span>
            </div>
          )}

          {fromQtyInput && (
            <div>
              <span className="text-gray-400">Valor (USD):</span>{" "}
              <span className="font-semibold text-yellow-400">${formatCurrency(usdFromFromQty)}</span>
              <span className="ml-3 text-gray-400">Receberá (estimado):</span>{" "}
              <span className="font-semibold text-cyan-400">{formatNumber(estimatedToQtyFromQty)} {toSymbol}</span>
            </div>
          )}

          {fromSymbol && (
            <div className="text-xs text-gray-500">Saldo disponível: {formatNumber(availableQty, 6)} {fromSymbol}</div>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn bg-gradient-to-r from-cyan-400 to-purple-400 text-black" disabled={!fromSymbol || !toSymbol}>Pré-visualizar</button>
        </div>
      </form>

      <TransactionPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        processing={processing}
        onConfirm={onConfirm}
        title={`Confirmar Swap ${fromSymbol} → ${toSymbol}`}
        payload={{
          typeLabel: "Swap",
          symbol: `${fromSymbol} → ${toSymbol}`,
          quantity: parsedFromQty > 0 ? parsedFromQty : (parsedUsd > 0 && fromPrice > 0 ? parsedUsd / fromPrice : 0),
          priceUsd: fromPrice,
          valueUsd: parsedFromQty > 0 ? usdFromFromQty : parsedUsd,
          fee: applyFee(parsedFromQty > 0 ? usdFromFromQty : parsedUsd).fee,
          netUsd: applyFee(parsedFromQty > 0 ? usdFromFromQty : parsedUsd).net,
        }}
      />
    </>
  );
}
