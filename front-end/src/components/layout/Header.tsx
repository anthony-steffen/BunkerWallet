import { RefreshCcw, Search, LogOut, Wallet } from "lucide-react";

interface HeaderProps {
	walletName: string;
	onRefresh: () => void;
}

export function Header({ walletName, onRefresh }: HeaderProps) {
	return (
		<header className="flex flex-row lg:justify-around fixed top-0 items-center gap-2 p-4 bg-base-100 shadow-md w-full z-10">
			{/* Nome da carteira */}
			<div className="flex gap-2 items-center align-center ms-5">
				<Wallet size={20} className="text-yellow-400 ms-15" />
				<h1 className="text-lg font-bold text-yellow-400">{walletName}</h1>
			</div>

			{/* Ações do header */}
			{/* Busca */}
			<div className="hidden md:flex items-center bg-base-200 rounded-lg px-3 py-1">
				<Search size={16} className="text-gray-400 mr-2" />
				<input
					type="text"
					placeholder="Buscar..."
					className="bg-transparent outline-none text-sm w-32 md:w-48"
				/>
			</div>
			<div className="flex items-center gap-2">
				{/* Atualizar */}
				<button
					className="btn btn-circle btn-ghost hover:bg-base-200"
					onClick={onRefresh}
					title="Atualizar">
					<RefreshCcw size={18} />
				</button>

				{/* Logout */}
				<button className="btn btn-circle btn-ghost text-red-500 hover:bg-red-500/10">
					<LogOut size={18} />
				</button>
			</div>
		</header>
	);
}
