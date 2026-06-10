import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Moon, Shield, Sun } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function Login() {
  const login = useLogin();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/home", { replace: true }),
      }
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10 text-base-content">
      <button
        className="btn btn-ghost btn-square fixed right-5 top-5"
        onClick={toggleTheme}
        title="Alternar tema"
      >
        {theme === "bunker-dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <section className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-2xl lg:grid-cols-[1fr_420px]">
        <div className="hidden bg-neutral p-10 text-neutral-content lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-content">
              <Shield size={24} />
            </div>
            <h1 className="max-w-md text-4xl font-semibold leading-tight">
              Controle sua carteira cripto com precos em tempo quase real.
            </h1>
            <p className="mt-4 max-w-md text-sm text-neutral-content/70">
              Registre compras, vendas, trocas e acompanhe saldo, historico e
              performance em uma experiencia simples de operar.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-white/10 p-3">Portfolio</div>
            <div className="rounded-lg bg-white/10 p-3">Mercado</div>
            <div className="rounded-lg bg-white/10 p-3">Transacoes</div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/15 text-secondary lg:hidden">
              <Shield size={22} />
            </div>
            <h2 className="text-2xl font-semibold">Entrar na BunkerWallet</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Acesse sua carteira para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control">
              <span className="label-text mb-1">Email</span>
              <input
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input input-bordered"
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Senha</span>
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input input-bordered"
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={login.isPending}
            >
              {login.isPending ? (
                "Entrando..."
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} /> Entrar
                </span>
              )}
            </button>
          </form>

          {login.isError && (
            <div className="alert alert-error mt-4">
              <span>Erro ao autenticar. Verifique email e senha.</span>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-base-content/60">
            Nao tem conta?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
