import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";

export interface MarketPrice {
  symbol: string;
  coingecko_id?: string;
  currency: string;
  price: number | null;
  market_cap: number | null;
  volume_24h: number | null;
  change_pct_24h: number | null;
  price_24h_ago: number | null;
  last_updated_at: string;
  stale?: boolean;
}

export type MarketPricesMap = Record<string, MarketPrice>;

function normalizeSymbols(symbols: string[]) {
  return Array.from(
    new Set(
      symbols
        .map((symbol) => String(symbol ?? "").trim().toUpperCase())
        .filter((symbol) => /^[A-Z0-9_]+$/.test(symbol))
        .filter(Boolean)
    )
  ).sort();
}

function marketQueryKey(symbols: string[], currency: string) {
  return ["marketPrices", currency.toLowerCase(), normalizeSymbols(symbols).join(",")];
}

function getWsBaseUrl() {
  const baseUrl = api.defaults.baseURL ?? window.location.origin;
  return baseUrl.replace(/^http/, "ws");
}

export function useMarketPrices(
  symbols: string[],
  currency = "usd",
  enabled = true
) {
  const symbolKey = normalizeSymbols(symbols).join(",");
  const normalized = useMemo(
    () => (symbolKey ? symbolKey.split(",") : []),
    [symbolKey]
  );

  return useQuery<MarketPricesMap>({
    queryKey: marketQueryKey(normalized, currency),
    queryFn: async () => {
      const res = await api.get("/market/prices", {
        params: { symbols: normalized.join(","), currency },
      });
      return res.data.prices;
    },
    enabled: enabled && normalized.length > 0,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useMarketStream(
  symbols: string[],
  currency = "usd",
  interval = 15
) {
  const queryClient = useQueryClient();
  const symbolKey = normalizeSymbols(symbols).join(",");
  const [prices, setPrices] = useState<MarketPricesMap>({});
  const [isLive, setIsLive] = useState(false);
  const [lastMessageAt, setLastMessageAt] = useState<string | null>(null);

  useEffect(() => {
    const streamSymbols = symbolKey ? symbolKey.split(",") : [];

    if (!streamSymbols.length) {
      setPrices({});
      setIsLive(false);
      return;
    }

    const ws = new WebSocket(
      `${getWsBaseUrl()}/market/ws?symbols=${encodeURIComponent(
        streamSymbols.join(",")
      )}&currency=${currency}&interval=${interval}`
    );

    ws.onopen = () => setIsLive(true);
    ws.onclose = () => setIsLive(false);
    ws.onerror = () => setIsLive(false);
    ws.onmessage = (event) => {
      let payload: { type?: string; prices?: MarketPricesMap };
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }

      if (payload.type !== "prices") return;

      setPrices(payload.prices ?? {});
      setLastMessageAt(new Date().toISOString());
      queryClient.setQueryData(
        marketQueryKey(streamSymbols, currency),
        payload.prices ?? {}
      );
    };

    return () => {
      ws.close();
    };
  }, [currency, interval, queryClient, symbolKey]);

  return { prices, isLive, lastMessageAt };
}
