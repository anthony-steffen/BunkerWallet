// src/components/Dashboard/Header.tsx

import { LogOut, RefreshCcw, Search, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/api";


export default function Header() {

  const [walletName, setWalletName] = useState<string>("Minha Carteira");

  async function fetchData() {
		try {
			const walletsRes = await api.get("/wallets/");
			if (walletsRes.data.length > 0) {
				const wallet = walletsRes.data[0];
				setWalletName(wallet.name);
			}
		} catch (error) {
			console.error("Erro ao carregar dados:", error);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);
  return (
    <header className=" flex justify-between items-center p-4 bg-base-100 shadow-md">
					<div className="flex items-center gap-2">
						<Wallet size={20} className="text-yellow-400" />
						<h1 className="text-lg font-bold text-yellow-400">{walletName}</h1>
					</div>

					<div className="flex items-center gap-3">
						{/* Busca */}
						<div className="hidden md:flex items-center bg-base-200 rounded-lg px-3 py-1">
							<Search size={16} className="text-gray-400 mr-2" />
							<input
								type="text"
								placeholder="Buscar..."
								className="bg-transparent outline-none text-sm w-32 md:w-48"
							/>
						</div>

						{/* Atualizar */}
						<button
							className="btn btn-circle btn-ghost hover:bg-base-200"
							onClick={fetchData}
							title="Atualizar">
							<RefreshCcw size={18} />
						</button>

						{/* Logout */}
						<button className="btn btn-circle btn-ghost text-red-500 hover:bg-red-500/10">
							<LogOut size={18} />
						</button>
					</div>
				</header>
        )
      }