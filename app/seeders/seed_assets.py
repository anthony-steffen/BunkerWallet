# app/seeders/seed_assets.py
import requests
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from app.db import SessionLocal
from app import models

COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets"


def fetch_top_assets(limit: int = 100):
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": limit,
        "page": 1,
        "sparkline": False,
    }
    resp = requests.get(COINGECKO_API, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def normalize_symbol(sym: str | None) -> str | None:
    if not sym:
        return None
    return sym.strip().upper()


def prepare_assets_payload(raw_data: list[dict]) -> list[dict]:
    """
    Transforma os dados da API em uma lista deduplicada de dicionários prontos para inserção.
    A deduplicação é feita por SYMBOL normalizado (uppercase).
    """
    by_symbol: dict[str, dict] = {}
    for coin in raw_data:
        sym = normalize_symbol(coin.get("symbol"))
        if not sym:
            continue

        # Se houver conflitos no lote, preferimos os dados mais recentes
        payload = {
            "name": coin.get("name"),
            "symbol": sym,
            "blockchain": coin.get("asset_platform_id") or "N/A",
            "description": coin.get("description")
            or f"Crypto asset {coin.get('name')}",
            "image": coin.get("image"),
            "price": (
                float(coin.get("current_price"))
                if coin.get("current_price") is not None
                else None
            ),
            "quantity": 0.0,
            "market_cap": (
                float(coin.get("market_cap"))
                if coin.get("market_cap") is not None
                else None
            ),
            "rank": (
                int(coin.get("market_cap_rank"))
                if coin.get("market_cap_rank") is not None
                else None
            ),
        }

        # guarda/atualiza por symbol (dedupe)
        by_symbol[sym] = payload

    return list(by_symbol.values())


def seed_assets_batch(limit: int = 100):
    db: Session = SessionLocal()
    try:
        raw = fetch_top_assets(limit=limit)
        payloads = prepare_assets_payload(raw)

        if not payloads:
            print("Nenhum ativo para inserir.")
            return

        # Usa a coluna real da tabela para index_elements
        symbol_col = models.Asset.__table__.c.symbol

        stmt = insert(models.Asset).values(payloads)

        # ON CONFLICT DO UPDATE para evitar UniqueViolation contra registros
        stmt = stmt.on_conflict_do_update(
            index_elements=[symbol_col],
            set_={
                "price": stmt.excluded.price,
                "market_cap": stmt.excluded.market_cap,
                "rank": stmt.excluded.rank,
                "image": stmt.excluded.image,
                "description": stmt.excluded.description,
                # se quiser atualizar name/blockchain também, adicione aqui
                "name": stmt.excluded.name,
                "blockchain": stmt.excluded.blockchain,
            },
        )

        db.execute(stmt)
        db.commit()
        print(f"✅ Seeder executado com {len(payloads)} registros (upsert).")

    except Exception as e:
        db.rollback()
        print("❌ Erro ao rodar seeder:", repr(e))

    finally:
        db.close()


if __name__ == "__main__":
    seed_assets_batch(limit=100)
