import { useMemo, useState } from "react";
import { Assets } from "@/types/Assets";

type Props = { assets: Assets[] | undefined };

export default function AssetsList({ assets }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const sortedAssets = useMemo(
    () => [...(assets ?? [])].sort((a, b) => (a.rank || 9999) - (b.rank || 9999)),
    [assets]
  );

  const totalPages = Math.max(1, Math.ceil(sortedAssets.length / pageSize));
  const paginatedAssets = sortedAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="wallet-panel rounded-lg p-4">
      <h3 className="mb-3 text-lg font-semibold">Top Assets</h3>

      <ul className="space-y-2">
        {paginatedAssets.map((asset) => (
          <li
            key={asset.id}
            className="flex items-center justify-between rounded-lg p-2 transition hover:bg-base-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={asset.image || "/placeholder.png"}
                alt={asset.name}
                className="h-8 w-8 rounded-full bg-base-300"
              />
              <div>
                <div className="font-medium">{asset.name}</div>
                <div className="text-sm wallet-muted">{asset.symbol}</div>
              </div>
            </div>
            <div className="text-sm font-semibold">
              ${asset.price?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        >
          Anterior
        </button>
        <span className="text-sm wallet-muted">
          Pagina {currentPage} de {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        >
          Proximo
        </button>
      </div>
    </div>
  );
}
