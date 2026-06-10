import { NavLink } from "react-router-dom";
import { Home, Layers, List, Menu, Shield, Wallet, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/home", label: "Portfolio", icon: Home },
  { to: "/wallets", label: "Carteiras", icon: Wallet },
  { to: "/assets", label: "Mercado", icon: Layers },
  { to: "/transactions", label: "Transacoes", icon: List },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-ghost btn-square fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-base-300/70 bg-base-100/95 p-5 backdrop-blur transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-content shadow-sm">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">BunkerWallet</p>
            <p className="text-xs text-base-content/55">Crypto portfolio</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary/12 text-primary"
                      : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-base-300/70 bg-base-200/70 p-3 text-xs text-base-content/60">
          Precos atualizados via CoinGecko com cache interno e stream do backend.
        </div>
      </aside>

      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}
