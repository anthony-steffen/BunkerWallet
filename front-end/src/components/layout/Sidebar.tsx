// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Home, Wallet, Layers, List, User, Menu } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>

      {/* Botão hambúrguer - visível apenas no mobile */}
          <button
            className="btn btn-ghost md:hidden fixed top-4 left-4 z-50"
            onClick={() => setOpen(!open)}
          >
            <Menu size={24} />
          </button>
      {/* Sidebar */}
      <aside
        className={`fixed h-screen md:static top-0 left-0 w-64 bg-base-300 p-4 transform transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center gap-3 mb-8 justify-end lg:justify-start">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
            BW
          </div>
          <div className="text-lg font-bold">BunkerWallet</div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg ${
                isActive ? "bg-base-200 text-yellow-400" : "text-gray-300"
              }`
            }
          >
            <Home size={16} className="inline mr-2" /> Dashboard
          </NavLink>
          <NavLink
            to="/wallets"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg ${
                isActive ? "bg-base-200 text-yellow-400" : "text-gray-300"
              }`
            }
          >
            <Wallet size={16} className="inline mr-2" /> Wallets
          </NavLink>
          <NavLink
            to="/assets"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg ${
                isActive ? "bg-base-200 text-yellow-400" : "text-gray-300"
              }`
            }
          >
            <Layers size={16} className="inline mr-2" /> Assets
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg ${
                isActive ? "bg-base-200 text-yellow-400" : "text-gray-300"
              }`
            }
          >
            <List size={16} className="inline mr-2" /> Transactions
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg ${
                isActive ? "bg-base-200 text-yellow-400" : "text-gray-300"
              }`
            }
          >
            <User size={16} className="inline mr-2" /> Profile
          </NavLink>
        </nav>
      </aside>

      {/* Overlay no mobile para fechar o menu ao clicar fora */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
