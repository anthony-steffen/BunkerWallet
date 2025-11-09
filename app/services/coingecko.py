# app/services/coingecko.py
import requests
import time

_CACHE = {"data": None, "timestamp": 0}
_CACHE_TTL = 600  # 10 minutos


def get_top_assets_cached():
    now = time.time()
    if _CACHE["data"] and now - _CACHE["timestamp"] < _CACHE_TTL:
        return _CACHE["data"]

    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 100,
        "page": 1,
        "sparkline": False,
    }
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    _CACHE["data"] = r.json()
    _CACHE["timestamp"] = now
    return _CACHE["data"]
