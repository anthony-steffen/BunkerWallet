import { ArrowDownToLine, Repeat2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FooterActions() {
  const navigate = useNavigate();
  const goToTransaction = (tab: string) => navigate(`/transactions?tab=${tab}`);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center border-t border-base-300/70 bg-base-100/90 p-3 backdrop-blur md:hidden">
      <div className="flex w-full max-w-sm items-center justify-evenly">
        <div className="group relative">
          <button
            className="btn btn-circle btn-secondary transition-transform duration-200 hover:scale-105"
            onClick={() => goToTransaction("buy")}
            aria-label="Comprar ativo"
          >
            <ArrowDownToLine size={22} />
          </button>
          <span className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-content opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
            Compra
          </span>
        </div>

        <div className="group relative">
          <button
            className="btn btn-circle btn-primary transition-transform duration-200 hover:scale-105"
            onClick={() => goToTransaction("swap")}
            aria-label="Trocar ativo"
          >
            <Repeat2 size={22} />
          </button>
          <span className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-md bg-primary px-2 py-1 text-sm text-primary-content opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
            Troca
          </span>
        </div>

        <div className="group relative">
          <button
            className="btn btn-circle btn-accent transition-transform duration-200 hover:scale-105"
            onClick={() => goToTransaction("send")}
            aria-label="Enviar ativo"
          >
            <Send size={22} />
          </button>
          <span className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-md bg-accent px-3 py-1 text-sm text-accent-content opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
            Envio
          </span>
        </div>
      </div>
    </footer>
  );
}
