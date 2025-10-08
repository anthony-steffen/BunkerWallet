// src/components/AssetsList.tsx
import { useState, useMemo } from "react";
import { Assets } from "@/types/Assets";

type Props = { assets: Assets[] | undefined };

export default function AssetsList({ assets }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ordena por rank e pagina
  const sortedAssets = useMemo(() => {
    return (assets ?? []).sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
  }, [assets]);

  const totalPages = Math.ceil(sortedAssets.length / pageSize);

  const paginatedAssets = sortedAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Top Assets</h3>

      <ul className="space-y-2">
        {paginatedAssets.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={a.image || "/placeholder.png"}
                alt={a.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-400">{a.symbol}</div>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-300">
              ${a.price?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </li>
        ))}
      </ul>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          ← Anterior
        </button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
