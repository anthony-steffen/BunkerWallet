// src/components/AssetsList.tsx
import { Assets } from "@/types/Assets";

type Props = { assets: Assets[] | undefined };

export default function AssetsList({ assets }: Props) {
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Top Assets</h3>
      <ul className="space-y-2">
        {assets?.slice(0, 5).map((a) => ( // mostra só os 5 primeiros para deixar limpo
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
    </div>
  );
}
