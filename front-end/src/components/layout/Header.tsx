import { RefreshCcw, Search, LogOut, Wallet } from "lucide-react";

interface HeaderProps {
  walletName: string;
  onRefresh: () => void;
}

export function Header({ walletName, onRefresh }: HeaderProps) {
  return (
    <header className="flex justify-end items-center lg:space-x-100 space-x-5 p-4 bg-base-100 shadow-md">
      {/* Nome da carteira */}
      <div className="flex items-center space-x-1 align-center">
        <Wallet size={20} className="text-yellow-400" />
        <h1 className="text-lg font-bold text-yellow-400">{walletName}</h1>
      </div>

      {/* Ações do header */}
      <div className="flex space-x-5">
        {/* Busca */}
        <div className="hidden md:flex items-center bg-base-200 rounded-lg px-3 py-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm w-32 md:w-48"
          />
        </div>

        {/* Atualizar */}
        <button
          className="btn btn-circle btn-ghost hover:bg-base-200"
          onClick={onRefresh}
          title="Atualizar"
        >
          <RefreshCcw size={18} />
        </button>

        {/* Logout */}
        <button className="btn btn-circle btn-ghost text-red-500 hover:bg-red-500/10">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
