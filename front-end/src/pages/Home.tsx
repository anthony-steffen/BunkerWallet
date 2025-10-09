import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as ChartTooltip,
} from "recharts";
import {
  RefreshCcw,
  LogOut,
  Wallet,
  Search,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import api from "../api/api";
import LayoutDashboards from "../components/layout/LayoutDashboard";
import { FooterActions } from "@/components/home/FooterActions";
import {Header} from "@/components/layout/Header";
import {
  generateMockHistory,
  performancePercentage,
  performanceColor,
} from "@/utils/assetPerformance";

interface Asset {
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  current_price: number;
  value_usd: number;
  percentage: number;
  purchase_price?: number;
  price_history?: number[];
}

interface PortfolioSummary {
  total_balance: number;
  assets: Asset[];
}

export default function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [walletName, setWalletName] = useState<string>("Minha Carteira");
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#FFD700",
    "#4FD1C5",
    "#9F7AEA",
    "#48BB78",
    "#F56565",
    "#4299E1",
  ];

  async function fetchData() {
    try {
      const walletsRes = await api.get("/wallets/");
      if (walletsRes.data.length > 0) {
        const wallet = walletsRes.data[0];
        setWalletName(wallet.name);
        const res = await api.get(`/wallets/${wallet.id}/portfolio`);
        setPortfolio(res.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const chartData =
    portfolio?.assets.map((a) => ({
      name: a.symbol,
      value: a.value_usd,
    })) || [];

  return (
    <div className="min-h-screen text-white flex flex-col">
      <LayoutDashboards>
        {/* HEADER */}
        <Header walletName={walletName} onRefresh={fetchData} />

        {/* CONTEÚDO */}
        <main className="flex-1 flex flex-col items-center px-4 py-6 shadow-md pb-24">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <>
              {/* GRÁFICO PRINCIPAL */}
              <div className="relative w-72 h-72 flex items-center justify-center mt-2">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={100}
                      stroke="none"
                    >
                      {chartData.length > 0 ? (
                        chartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))
                      ) : (
                        <Cell fill="#ffffff22" />
                      )}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "none",
                        color: "white",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* SALDO CENTRAL */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold">
                    $
                    {portfolio?.total_balance
                      ? portfolio.total_balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </p>
                  <p className="text-sm text-gray-400">Saldo total</p>
                </div>
              </div>

              {/* LISTA DE ATIVOS */}
              <div className="mt-6 w-full space-y-3">
                {portfolio?.assets && portfolio.assets.length > 0 ? (
                  portfolio.assets.map((asset, idx) => {
                    const history =
                      asset.price_history && asset.price_history.length > 0
                        ? asset.price_history
                        : generateMockHistory(
                            asset.current_price,
                            asset.purchase_price,
                            7
                          );

                    const startPrice = history[0];
                    const endPrice = asset.current_price;
                    const pct = performancePercentage(startPrice, endPrice);
                    const pctFormatted = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
                    const color = performanceColor(startPrice, endPrice);

                    const PerformanceIcon =
                      pct >= 0 ? (
                        <TrendingUp size={12} className="text-green-400" />
                      ) : (
                        <TrendingDown size={12} className="text-red-400" />
                      );

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-base-100/10 rounded-xl p-3 hover:bg-base-100/20 transition"
                      >
                        {/* Esquerda: imagem + nome */}
                        <div className="flex items-center gap-3">
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">{asset.name}</p>
                            <p className="text-xs text-gray-400">
                              {asset.quantity} {asset.symbol}
                            </p>
                          </div>
                        </div>

                        {/* Centro: mini gráfico + variação */}
                        <div className="w-36 h-12 flex items-center justify-center relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={history.map((v, i) => ({
                                value: v,
                                index: i,
                              }))}
                              margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                            >
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                              />
                              <ChartTooltip
                                contentStyle={{
                                  background: "#0f172a",
                                  border: "none",
                                  color: "white",
                                  fontSize: "0.75rem",
                                }}
                                formatter={(value: number) =>
                                  `$${value.toFixed(2)}`
                                }
                              />
                            </LineChart>
                          </ResponsiveContainer>

                          <div className="absolute right-1 top-0 text-xs font-medium flex items-center gap-1">
                            {PerformanceIcon}
                            <span style={{ color }}>{pctFormatted}</span>
                          </div>
                        </div>

                        {/* Direita: valores */}
                        <div className="text-right">
                          <p className="font-semibold">
                            ${asset.value_usd.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            ${asset.current_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-400 mt-4">
                    Nenhum ativo encontrado nesta carteira
                  </p>
                )}
              </div>
            </>
          )}
        </main>

        {/* FOOTER */}
        <FooterActions />
      </LayoutDashboards>
    </div>
  );
}
