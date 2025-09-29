// src/components/AssetsList.tsx
import { Assets } from "@/types/Assets";

type Props = { assets: Assets[] | undefined };

export default function AssetsList({ assets }: Props) {
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Recent Assets</h3>
      <ul className="space-y-2">
        {assets?.map(a => (
          <li key={a.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">{a.symbol[0]}</div>
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-400">{a.symbol}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">$--</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
