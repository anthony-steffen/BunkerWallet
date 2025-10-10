// src/components/home/AssetPerformanceChart.tsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export type ChartPoint = {
  date: string; // label para tooltip / eixo X (ex: '2025-10-01' ou 'Day 1')
  price: number;
};

interface Props {
  data?: ChartPoint[]; // série de preços (do mais antigo para o mais recente)
  performance_pct?: number; // usado para decidir cor padrão quando color não é passada
  color?: string; // opcional: força a cor da linha (ex.: mesma cor do donut)
  height?: number; // altura em px (padrão 60)
  className?: string;
}

const formatCurrency = (v?: number) =>
  `$${Number(v ?? 0).toFixed(2)}`;

/**
 * Mini gráfico de performance para cada ativo.
 * - Aceita dados simulados ou reais.
 * - Se receber apenas 1 ponto, duplica para desenhar linha.
 * - Calcula domínio Y com padding para melhor visual.
 */
export const AssetPerformanceChart: React.FC<Props> = ({
  data = [],
  performance_pct = 0,
  color,
  height = 60,
  className,
}) => {
  // garante pelo menos 2 pontos para o chart (evita linha invisível)
  const points = useMemo<ChartPoint[]>(() => {
    if (!data || data.length === 0) return [];
    if (data.length === 1) {
      const only = data[0];
      // cria um pequeno segundo ponto (mesma data + sufixo) para permitir renderizar uma linha
      return [only, { date: only.date + " ·", price: only.price }];
    }
    return data;
  }, [data]);

  // cor: prefer user-provided, caso contrário verde/verm if positivo/negativo
  const stroke = color ?? (performance_pct >= 0 ? "#22C55E" : "#EF4444");

  // calcular domínio Y (min/max) com padding para não ficar "linha colada nas bordas"
  const domain = useMemo<[number, number]>(() => {
    if (!points || points.length === 0) return [0, 1];
    const prices = points.map((p) => Number(p.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) {
      const delta = Math.max(1, Math.abs(min * 0.02)); // pelo menos +/-1 ou 2%
      return [min - delta, max + delta];
    }

    const pad = Math.max((max - min) * 0.08, 1e-6); // 8% padding mínimo
    return [min - pad, max + pad];
  }, [points]);

  if (!points || points.length === 0) {
    // placeholder minimal quando não há dados
    return (
      <div
        className={className}
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden
      >
        <span className="text-xs text-gray-500">—</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <XAxis dataKey="date" hide />
          <YAxis domain={domain} hide />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            // z-index do tooltip (caso precise ficar acima de outros elementos)
            wrapperStyle={{ zIndex: 9999, outline: "none" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.04)",
              color: "#fff",
              fontSize: 12,
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(AssetPerformanceChart);
