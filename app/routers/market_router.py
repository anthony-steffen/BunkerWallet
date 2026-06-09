import asyncio
from typing import Annotated

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from app.services.market_data import market_data_service


router = APIRouter(prefix="/market", tags=["Market"])


def _parse_symbols(symbols: str) -> list[str]:
    return market_data_service.normalize_symbols(symbols.split(","))


@router.get("/prices")
def get_market_prices(
    symbols: Annotated[str, Query(description="Lista separada por virgulas")],
    currency: str = "usd",
):
    prices = market_data_service.get_prices(_parse_symbols(symbols), currency)
    return {
        "currency": currency.lower(),
        "symbols": list(prices.keys()),
        "prices": prices,
    }


@router.get("/history/{symbol}")
def get_market_history(symbol: str, currency: str = "usd", days: int = 7):
    return market_data_service.get_history(symbol, currency, days)


@router.websocket("/ws")
async def market_prices_ws(
    websocket: WebSocket,
    symbols: str,
    currency: str = "usd",
    interval: int = 15,
):
    await websocket.accept()
    normalized_symbols = _parse_symbols(symbols)
    interval = max(5, min(interval, 60))

    try:
        while True:
            prices = await asyncio.to_thread(
                market_data_service.get_prices,
                normalized_symbols,
                currency,
            )
            await websocket.send_json(
                {
                    "type": "prices",
                    "currency": currency.lower(),
                    "symbols": normalized_symbols,
                    "prices": prices,
                }
            )
            await asyncio.sleep(interval)
    except WebSocketDisconnect:
        return
