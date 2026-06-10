import { LogOut, Moon, RefreshCcw, Search, Sun, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  walletName: string;
  onRefresh?: () => void;
}

export function Header({ walletName, onRefresh }: HeaderProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-base-300/70 bg-base-100/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="ml-12 flex items-center gap-3 md:ml-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
            <Wallet size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">{walletName}</h1>
            <p className="hidden text-xs text-base-content/55 sm:block">
              Carteira digital de criptoativos
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <label className="input input-sm input-bordered flex w-full max-w-md items-center gap-2 bg-base-200">
            <Search size={15} className="text-base-content/45" />
            <input type="search" className="grow" placeholder="Buscar ativo ou transacao" />
          </label>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="btn btn-ghost btn-sm btn-square"
            onClick={onRefresh}
            title="Atualizar"
            disabled={!onRefresh}
          >
            <RefreshCcw size={17} />
          </button>
          <button
            className="btn btn-ghost btn-sm btn-square"
            onClick={toggleTheme}
            title="Alternar tema"
          >
            {theme === "bunker-dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className="btn btn-ghost btn-sm btn-square text-error"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
