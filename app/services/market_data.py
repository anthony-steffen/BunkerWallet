from __future__ import annotations

import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterable

import requests


COINGECKO_SIMPLE_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price"
COINGECKO_MARKET_CHART_URL = (
    "https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
)

COINGECKO_IDS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "BNB": "binancecoin",
    "XRP": "ripple",
    "ADA": "cardano",
    "USDT": "tether",
    "USDC": "usd-coin",
    "DOT": "polkadot",
    "DOGE": "dogecoin",
    "DODGE": "dogecoin",
    "SHIB": "shiba-inu",
    "UNI": "uniswap",
    "LINK": "chainlink",
    "AVAX": "avalanche-2",
    "MATIC": "matic-network",
    "POL": "polygon-ecosystem-token",
    "AAVE": "aave",
    "SUSHI": "sushi",
    "NEAR": "near",
    "ATOM": "cosmos",
    "LTC": "litecoin",
    "BCH": "bitcoin-cash",
    "ETC": "ethereum-classic",
    "FIL": "filecoin",
    "APT": "aptos",
    "ARB": "arbitrum",
    "OP": "optimism",
}


@dataclass
class MarketCacheEntry:
    data: dict
    timestamp: float


class MarketDataService:
    def __init__(self, ttl_seconds: int = 15):
        self.ttl_seconds = ttl_seconds
        self._price_cache: dict[str, MarketCacheEntry] = {}
        self._history_cache: dict[str, MarketCacheEntry] = {}

    def normalize_symbols(self, symbols: Iterable[str]) -> list[str]:
        normalized = []
        for symbol in symbols:
            value = (symbol or "").strip().upper()
            if value and value not in normalized:
                normalized.append(value)
        return normalized

    def coingecko_id_for(self, symbol: str) -> str | None:
        return COINGECKO_IDS.get(symbol.upper())

    def get_prices(
        self, symbols: Iterable[str], currency: str = "usd"
    ) -> dict[str, dict]:
        normalized = self.normalize_symbols(symbols)
        currency = currency.lower()
        now = time.time()

        fresh_prices: dict[str, dict] = {}
        missing = []

        for symbol in normalized:
            cache_key = f"{symbol}:{currency}"
            cached = self._price_cache.get(cache_key)
            if cached and now - cached.timestamp < self.ttl_seconds:
                fresh_prices[symbol] = cached.data
            else:
                missing.append(symbol)

        ids = {
            symbol: self.coingecko_id_for(symbol)
            for symbol in missing
            if self.coingecko_id_for(symbol)
        }

        if ids:
            try:
                response = requests.get(
                    COINGECKO_SIMPLE_PRICE_URL,
                    params={
                        "ids": ",".join(ids.values()),
                        "vs_currencies": currency,
                        "include_market_cap": "true",
                        "include_24hr_vol": "true",
                        "include_24hr_change": "true",
                        "include_last_updated_at": "true",
                    },
                    timeout=10,
                )
                response.raise_for_status()
                payload = response.json()

                for symbol, coin_id in ids.items():
                    info = payload.get(coin_id, {})
                    price = info.get(currency)
                    change_pct = info.get(f"{currency}_24h_change")
                    last_updated_at = info.get("last_updated_at")

                    price_data = {
                        "symbol": symbol,
                        "coingecko_id": coin_id,
                        "currency": currency,
                        "price": price,
                        "market_cap": info.get(f"{currency}_market_cap"),
                        "volume_24h": info.get(f"{currency}_24h_vol"),
                        "change_pct_24h": change_pct,
                        "price_24h_ago": self._price_24h_ago(
                            price, change_pct
                        ),
                        "last_updated_at": (
                            datetime.fromtimestamp(
                                last_updated_at, tz=timezone.utc
                            ).isoformat()
                            if last_updated_at
                            else datetime.now(timezone.utc).isoformat()
                        ),
                    }
                    cache_key = f"{symbol}:{currency}"
                    self._price_cache[cache_key] = MarketCacheEntry(
                        data=price_data, timestamp=now
                    )
                    fresh_prices[symbol] = price_data
            except requests.RequestException:
                for symbol in ids:
                    cache_key = f"{symbol}:{currency}"
                    cached = self._price_cache.get(cache_key)
                    if cached:
                        fresh_prices[symbol] = {
                            **cached.data,
                            "stale": True,
                        }

        for symbol in missing:
            if symbol not in fresh_prices:
                fresh_prices[symbol] = {
                    "symbol": symbol,
                    "currency": currency,
                    "price": None,
                    "market_cap": None,
                    "volume_24h": None,
                    "change_pct_24h": None,
                    "price_24h_ago": None,
                    "last_updated_at": datetime.now(timezone.utc).isoformat(),
                }

        return {symbol: fresh_prices[symbol] for symbol in normalized}

    def get_history(
        self, symbol: str, currency: str = "usd", days: int = 7
    ) -> dict:
        normalized = self.normalize_symbols([symbol])
        if not normalized:
            return {"symbol": symbol, "currency": currency, "prices": []}

        symbol = normalized[0]
        currency = currency.lower()
        days = max(1, min(days, 365))
        cache_key = f"{symbol}:{currency}:{days}"
        now = time.time()

        cached = self._history_cache.get(cache_key)
        if cached and now - cached.timestamp < 60:
            return cached.data

        coin_id = self.coingecko_id_for(symbol)
        if not coin_id:
            return {"symbol": symbol, "currency": currency, "prices": []}

        response = requests.get(
            COINGECKO_MARKET_CHART_URL.format(coin_id=coin_id),
            params={"vs_currency": currency, "days": days},
            timeout=10,
        )
        response.raise_for_status()
        payload = response.json()

        history = {
            "symbol": symbol,
            "coingecko_id": coin_id,
            "currency": currency,
            "prices": [
                {"timestamp": point[0], "price": point[1]}
                for point in payload.get("prices", [])
            ],
        }
        self._history_cache[cache_key] = MarketCacheEntry(
            data=history, timestamp=now
        )
        return history

    @staticmethod
    def _price_24h_ago(price, change_pct):
        if price is None or change_pct in (None, -100):
            return None
        try:
            return price / (1 + (change_pct / 100))
        except ZeroDivisionError:
            return None


market_data_service = MarketDataService()
