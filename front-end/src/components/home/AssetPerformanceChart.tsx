// src/components/home/AssetPerformanceChart.tsx
import React, { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { PricePoint } from "@/utils/generatePriceHistory";

interface Props {
  points: PricePoint[];
  strokeColor?: string;
  height?: number;
}

const AssetPerformanceChart: React.FC<Props> = ({
  points = [],
  strokeColor = "#8884D8",
  height = 56,
}) => {
  
  // Ajuste da escala vertical
  const domain = useMemo<[number, number]>(() => {
    const vals = points.map((p) => p.price);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 0.5;
    const pad = range * 0.3;
    return [min - pad, max + pad];
  }, [points]);
  
  if (!points || points.length === 0)
    return <div className="text-gray-500 text-xs text-center italic">–</div>;
  
  return (
    <div style={{ width: "100%", minHeight: `${height}px`, height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, right: 6, left: 6, bottom: 2 }}>
          <XAxis dataKey="date" hide />
          <YAxis domain={domain} hide />
          <Tooltip
            wrapperStyle={{ zIndex: 9999 }}
            formatter={(v: number) => [`$${v.toFixed(2)}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(AssetPerformanceChart);
