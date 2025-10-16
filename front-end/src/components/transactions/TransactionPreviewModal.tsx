/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/transactions/TransactionPreviewModal.tsx
import React from "react";
import { formatCurrency, formatNumber } from "@/utils/format";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  payload: {
    typeLabel: string;
    symbol: string;
    quantity: number;
    priceUsd: number;
    valueUsd: number;
    fee: number;
    netUsd: number;
    extra?: Record<string, any>;
  };
  processing?: boolean;
}

export default function TransactionPreviewModal({
  open,
  onClose,
  onConfirm,
  title = "Confirme a transação",
  payload,
  processing = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-w-md w-full bg-base-100/90 rounded-xl p-6 border border-base-300/20 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>

        <div className="text-sm space-y-2 mb-4 text-gray-300">
          <div className="flex justify-between">
            <span className="text-gray-400">Operação</span>
            <strong>{payload.typeLabel}</strong>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Ativo</span>
            <strong>{payload.symbol}</strong>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Quantidade</span>
            <strong>{formatNumber(payload.quantity, 6)}</strong>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Preço (USD)</span>
            <strong>${formatCurrency(payload.priceUsd, 4)}</strong>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Valor bruto</span>
            <strong>${formatCurrency(payload.valueUsd, 2)}</strong>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Fee</span>
            <strong>-${formatCurrency(payload.fee, 2)}</strong>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Total líquido</span>
            <strong>${formatCurrency(payload.netUsd, 2)}</strong>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="btn btn-ghost border border-base-300/20 text-gray-200"
            disabled={processing}
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                await onConfirm();
              } catch (err) {
                console.error("Erro ao confirmar transação:", err);
              }
            }}
            className="btn bg-gradient-to-r from-yellow-400 to-cyan-400 text-black"
            disabled={processing}
          >
            {processing ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
