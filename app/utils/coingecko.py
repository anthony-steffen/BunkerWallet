# app/utils/coingecko.py
import requests

API_URL = "https://api.coingecko.com/api/v3/simple/price"

# 🔁 Mapa local de symbols -> IDs reais da CoinGecko
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
    "DODGE": "dodgecoin",
    "SHIB": "shiba-inu",
    "UNI": "uniswap",
    "LINK": "chainlink",
    "AVAX": "avalanche-2",
    "MATIC": "polygon",
    "AAVE": "aave",
    "SUSHI": "sushi",
    "NEAR": "near",
    "LUNA": "terra-luna",
    "ATOM": "cosmos",
    "FTT": "ftx-token",
    "SECURITY": "security-token-chain",
}


def fetch_asset_price(symbol: str, currency: str = "usd"):
    """
    Busca o preço atual e a variação de 24h do ativo usando CoinGecko.
    - Mapeia o símbolo para o ID correto.
    - Usa apenas requests.
    - Retorna dicionário com preços e variação.
    """
    try:
        if not symbol:
            return None

        cg_id = COINGECKO_IDS.get(symbol.upper())
        if not cg_id:
            print(
                f"[WARN] Symbol '{symbol}' não encontrado no mapa de CoinGecko."
            )
            return None

        response = requests.get(
            API_URL,
            params={
                "ids": cg_id,
                "vs_currencies": currency,
                "include_24hr_change": "true",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()

        if cg_id not in data:
            print(
                f"[WARN] ID '{cg_id}' não retornou resultados da API CoinGecko."
            )
            return None

        info = data[cg_id]
        current_price = info.get(currency)
        change_pct_24h = info.get(f"{currency}_24h_change", 0.0)

        # Calcula o preço de 24h atrás
        price_24h_ago = (
            current_price / (1 + (change_pct_24h / 100))
            if current_price and change_pct_24h is not None
            else None
        )

        return {
            "current_price": current_price,
            "price_24h_ago": price_24h_ago,
            "performance_pct_24h": change_pct_24h,
        }

    except Exception as e:
        print(f"[ERROR] Falha ao buscar preço para {symbol}: {e}")
        return None
