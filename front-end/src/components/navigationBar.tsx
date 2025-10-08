import { NavLink } from "react-router-dom";
import { Home, BarChart3, List, User } from "lucide-react";

export default function NavigationBar() {
  return (
   <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-base-100/30 backdrop-blur-md
        border-t border-base-300
        flex justify-around items-center py-3
        shadow-lg z-50
      "
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          `btn btn-ghost btn-circle ${isActive ? "text-primary" : "text-gray-400"}`
        }
        title="Início"
      >
        <Home size={22} />
      </NavLink>

      <NavLink
        to="/assets"
        className={({ isActive }) =>
          `btn btn-ghost btn-circle ${isActive ? "text-primary" : "text-gray-400"}`
        }
        title="Ativos"
      >
        <BarChart3 size={22} />
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `btn btn-ghost btn-circle ${isActive ? "text-primary" : "text-gray-400"}`
        }
        title="Transações"
      >
        <List size={22} />
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `btn btn-ghost btn-circle ${isActive ? "text-primary" : "text-gray-400"}`
        }
        title="Perfil"
      >
        <User size={22} />
      </NavLink>
    </nav>
  );
}
