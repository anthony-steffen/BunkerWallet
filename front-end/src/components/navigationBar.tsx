import { NavLink } from "react-router-dom";
import { BarChart3, Home, List, Wallet } from "lucide-react";

export default function NavigationBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `btn btn-ghost btn-circle ${isActive ? "text-primary" : "text-base-content/60"}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-base-300 bg-base-100/90 py-3 shadow-lg backdrop-blur">
      <NavLink to="/home" className={linkClass} title="Inicio">
        <Home size={22} />
      </NavLink>

      <NavLink to="/assets" className={linkClass} title="Ativos">
        <BarChart3 size={22} />
      </NavLink>

      <NavLink to="/transactions" className={linkClass} title="Transacoes">
        <List size={22} />
      </NavLink>

      <NavLink to="/wallets" className={linkClass} title="Carteiras">
        <Wallet size={22} />
      </NavLink>
    </nav>
  );
}
