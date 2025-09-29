import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { LogIn } from "lucide-react";
import { Shield, CircleDollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const login = useLogin();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		login.mutate(
			{ email, password },
			{
				onSuccess: () => {
					console.log("✅ Login realizado, redirecionando...");
					navigate("/dashboard");
				},
			}
		);
	}

	return (
		<div className="card w-full max-w-sm max-h-full backdrop-blur-lg mx-auto mt-20  p-2 ">
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
					Faça login para acessar sua conta
				</p>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
							login.isPending ? "loading" : ""
						}`}
						disabled={login.isPending}>
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
					<div className="alert alert-error mt-4 rounded-xl">
						<span>❌ Erro ao autenticar. Verifique suas credenciais.</span>
					</div>
				)}

				{/* Link de registro */}
				<p className="text-center mt-6 text-sm text-gray-400">
					Não tem conta?{" "}
					<a href="/register" className="text-yellow-400 hover:underline">
						Criar conta
					</a>
				</p>
			</div>
		</div>
	);
}
