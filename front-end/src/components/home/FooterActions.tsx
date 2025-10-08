import { ArrowDownToLine, Repeat2, Send } from "lucide-react";

export function FooterActions() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 p-4 flex justify-evenly items-center backdrop-blur-md shadow-inner">
      {/* Compra de ativos */}
      <div className="relative group">
        <button className="btn btn-circle btn-warning cursor-pointer transition-transform duration-200 hover:scale-110">
          <ArrowDownToLine size={22} />
        </button>
        <span
          className="absolute bottom-14 left-1/2 -translate-x-1/2 text-sm px-2 py-1 rounded-md bg-yellow-500 text-black opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-200 pointer-events-none shadow-lg"
        >
          Compra
        </span>
      </div>

      {/* Swap de ativos */}
      <div className="relative group">
        <button className="btn btn-circle btn-warning cursor-pointer transition-transform duration-200 hover:scale-110">
          <Repeat2 size={22} />
        </button>
        <span
          className="absolute bottom-14 left-1/2 -translate-x-1/2 text-sm px-2 py-1 rounded-md bg-purple-500 text-white opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-200 pointer-events-none shadow-lg"
        >
          Troca
        </span>
      </div>

      {/* Transferência de ativos */}
      <div className="relative group">
        <button className="btn btn-circle btn-warning cursor-pointer transition-transform duration-200 hover:scale-110">
          <Send size={22} />
        </button>
        <span
          className="absolute bottom-14 left-1/2 -translate-x-1/2 text-sm px-3 py-1 rounded-md bg-emerald-500 text-white opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-200 pointer-events-none shadow-lg"
        >
          Transferência
        </span>
      </div>
    </footer>
  );
}