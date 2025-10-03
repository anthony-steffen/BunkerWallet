import { useEffect, useState } from "react";
import { Search, LogOut, Wallet } from "lucide-react";
import  api  from "@/api/api";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  price: number;
  image: string;
  rank: number;
}

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    api.get("/assets/").then((res) => {
      const sorted = res.data.sort((a: Asset, b: Asset) => a.rank - b.rank);
      setAssets(sorted);
    });
  }, []);

  const paginatedAssets = assets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-base-200 text-base-content text-ce">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-base-100 px-4 py-3 shadow rounded-lg">
      {/* Logo */}
      <h1 className="text-lg font-bold text-yellow-400 ms-10">BunkerWallet</h1>

      {/* Ações */}
      <div className="flex items-center gap-3">
        {/* Campo de busca (visível apenas no md+) */}
        <div className="hidden md:flex items-center bg-base-200 rounded-lg px-2 py-1">
          <Search size={18} className="text-gray-400 mr-1" />
          <input
            type="text"
            placeholder="Buscar ativo..."
            className="bg-transparent outline-none text-sm w-32 md:w-48"
          />
        </div>

        {/* Criar Carteira */}
        <button className="btn btn-sm btn-warning gap-1">
          <Wallet size={16} />
          <span className="hidden sm:inline">Criar Carteira</span>
        </button>

        {/* Logout */}
        <button className="btn btn-ghost btn-circle text-red-500 hover:bg-red-500/10">
          <LogOut size={20} />
        </button>
      </div>
    </header>

      {/* MAIN */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RESUMO PORTFÓLIO */}
        <div className="card bg-base-100 shadow-md col-span-1 lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Resumo do Portfólio</h2>
            <p className="text-3xl font-bold">$125,430.55</p>
            <p className="text-success">+2.5% nas últimas 24h</p>
          </div>
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Ações Rápidas</h2>
            <button className="btn btn-success">Nova Transação</button>
            <button className="btn btn-outline">Importar Carteira</button>
          </div>
        </div>

        {/* LISTA DE ATIVOS */}
        <div className="card bg-base-100 shadow-md col-span-1 lg:col-span-3">
          <div className="card-body">
            <h2 className="card-title">Principais Ativos</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ativo</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td>{asset.rank}</td>
                      <td className="flex items-center gap-2">
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="w-6 h-6"
                        />
                        <span>{asset.name} ({asset.symbol})</span>
                      </td>
                      <td>${asset.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINAÇÃO */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
              <button
                className="btn btn-outline btn-sm"
                disabled={page * itemsPerPage >= assets.length}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
