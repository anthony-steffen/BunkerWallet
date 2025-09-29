import { useState } from "react";
import { useRegister } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Shield, CircleDollarSign } from "lucide-react";

export default function Register() {
  const register = useRegister();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          navigate("/login"); // redireciona após sucesso
        },
      }
    );
  }

  return (
      <div className="card w-full max-w-md max-h-full mx-auto mt-20 p-2">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center justify-center gap-2">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 shadow-lg">
              <Shield size={28} className="text-gray-900" />
              <CircleDollarSign
                size={14}
                className="absolute bottom-1 right-1 text-gray-900"
              />
            </div>
            <h1 className="text-2xl font-bold text-yellow-400">BunkerWallet</h1>
          </div>
          <p className="text-center text-gray-400 text-sm">
            Crie sua conta para começar
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <input
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full bg-gray-900/60 text-gray-200 border-gray-700 focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-gray-900/60 text-gray-200 border-gray-700 focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-gray-900/60 text-gray-200 border-gray-700 focus:border-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl shadow-md border-none ${
                register.isPending ? "loading" : ""
              }`}
              disabled={register.isPending}
            >
              {register.isPending ? (
                "Registrando..."
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={18} /> Registrar
                </span>
              )}
            </button>
          </form>

          {register.isError && (
            <div className="alert alert-error mt-4 rounded-xl">
              <span>❌ Erro ao registrar. Verifique os dados.</span>
            </div>
          )}

          {/* Link para login */}
          <p className="text-center mt-6 text-sm text-gray-400">
            Já tem conta?{" "}
            <Link to="/login" className="text-yellow-400 hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>

  );
}
