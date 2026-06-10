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
    extra?: Record<string, unknown>;
  };
  processing?: boolean;
}

export default function TransactionPreviewModal({
  open,
  onClose,
  onConfirm,
  title = "Confirme a transacao",
  payload,
  processing = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="wallet-panel relative z-10 w-full max-w-md rounded-lg p-6">
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="wallet-muted">Operacao</span>
            <strong>{payload.typeLabel}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span className="wallet-muted">Ativo</span>
            <strong>{payload.symbol}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span className="wallet-muted">Quantidade</span>
            <strong>{formatNumber(payload.quantity, 6)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span className="wallet-muted">Preco (USD)</span>
            <strong>${formatCurrency(payload.priceUsd, 4)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span className="wallet-muted">Valor bruto</span>
            <strong>${formatCurrency(payload.valueUsd, 2)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span className="wallet-muted">Fee</span>
            <strong>-${formatCurrency(payload.fee, 2)}</strong>
          </div>

          <div className="flex justify-between gap-4 border-t border-base-300 pt-2">
            <span className="wallet-muted">Total liquido</span>
            <strong>${formatCurrency(payload.netUsd, 2)}</strong>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost border border-base-300"
            disabled={processing}
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                await onConfirm();
              } catch (err) {
                console.error("Erro ao confirmar transacao:", err);
              }
            }}
            className="btn btn-primary"
            disabled={processing}
          >
            {processing ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
