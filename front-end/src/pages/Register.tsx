import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Shield, Sun, UserPlus } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function Register() {
  const register = useRegister();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    register.mutate(
      { name, email, password },
      {
        onSuccess: () => navigate("/login", { replace: true }),
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

      <section className="w-full max-w-md rounded-lg border border-base-300 bg-base-100 p-6 shadow-2xl sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-semibold">Criar conta</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Comece a acompanhar sua carteira cripto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-1">Nome</span>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="input input-bordered"
              required
            />
          </label>
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
              placeholder="Minimo recomendado: 6 caracteres"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input input-bordered"
              required
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={register.isPending}
          >
            {register.isPending ? (
              "Criando..."
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus size={18} /> Criar conta
              </span>
            )}
          </button>
        </form>

        {register.isError && (
          <div className="alert alert-error mt-4">
            <span>Erro ao registrar. Verifique os dados informados.</span>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-base-content/60">
          Ja tem conta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </section>
    </main>
  );
}
