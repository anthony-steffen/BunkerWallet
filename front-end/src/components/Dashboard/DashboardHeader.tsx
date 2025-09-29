// src/components/Dashboard/DashboardHeader.tsx
import { Search, Bell, LogOut } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-end bg-base-100 gap-10 p-4 rounded-lg shadow mb-6 w-full lg:gap-210">
      <div className="flex items-center gap-4">
      {/* Título */}
      <h1 className="text-xl font-bold text-yellow-400">Dashboard</h1>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-4">
        {/* Campo de busca */}
        <div className="hidden md:flex items-center bg-base-200 rounded-lg px-3 py-1">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>

        {/* Notificações */}
        <button className="btn btn-ghost btn-circle">
          <Bell size={20} />
        </button>

        {/* Logout */}
        <button className="btn btn-ghost btn-circle text-red-500 hover:bg-red-500/10">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
