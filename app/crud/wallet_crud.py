from fastapi import HTTPException
from sqlalchemy.orm import Session
from app import models, schemas

from decimal import Decimal
from app.utils.coingecko import fetch_asset_price
from app.utils.asset_colors import get_asset_color


def create_wallet(db: Session, wallet: schemas.WalletCreate):
    db_wallet = models.Wallet(
        name=wallet.name,
        user_id=wallet.user_id,
    )
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet


def get_wallets_by_user(db: Session, user_id: int):
    return (
        db.query(models.Wallet).filter(models.Wallet.user_id == user_id).all()
    )


def get_portfolio_summary(db: Session, wallet_id: int):
    transactions = (
        db.query(models.Transaction)
        .filter(models.Transaction.wallet_id == wallet_id)
        .order_by(models.Transaction.timestamp.asc())
        .all()
    )

    if not transactions:
        return {"total_balance": 0, "assets": []}

    assets_map: dict[int, dict] = {}

    for tx in transactions:
        aid = tx.asset_id
        if aid not in assets_map:
            asset = (
                db.query(models.Asset).filter(models.Asset.id == aid).first()
            )
            assets_map[aid] = {
                "asset": asset,
                "quantity": Decimal(0),
                "total_cost": Decimal(0),
            }

        rec = assets_map[aid]
        amt = Decimal(tx.amount)
        price = Decimal(tx.price or 0)

        if tx.type.value == "buy":
            rec["quantity"] += amt
            rec["total_cost"] += amt * price
        elif tx.type.value == "sell":
            if rec["quantity"] > 0:
                avg_price = rec["total_cost"] / rec["quantity"]
                rec["quantity"] -= amt
                rec["total_cost"] -= amt * avg_price

    assets_data = []
    total_balance = Decimal(0)

    for aid, rec in assets_map.items():
        asset = rec["asset"]
        qty = rec["quantity"]
        total_cost = rec["total_cost"]

        if qty <= 0:
            continue

        avg_price = (total_cost / qty) if qty != 0 else Decimal(0)
        current_price = Decimal(asset.price or 0)
        current_value = qty * current_price
        total_balance += current_value

        # 🧩 Enriquecer com dados da CoinGecko
        api_data = fetch_asset_price(asset.symbol)
        price_24h_ago = (
            Decimal(api_data.get("price_24h_ago") or 0)
            if api_data
            else Decimal(0)
        )
        performance_24h = (
            Decimal(api_data.get("performance_pct_24h") or 0)
            if api_data
            else Decimal(0)
        )

        change_24h_usd = (
            (current_price - price_24h_ago) * qty
            if price_24h_ago > 0
            else Decimal(0)
        )

        performance_pct = (
            ((current_price - avg_price) / avg_price * 100)
            if avg_price > 0
            else Decimal(0)
        )

        assets_data.append(
            {
                "name": asset.name,
                "symbol": asset.symbol,
                "color": get_asset_color(asset.symbol),
                "image": asset.image,
                "quantity": float(round(qty, 6)),
                "current_price": float(round(current_price, 4)),
                "purchase_price": float(round(avg_price, 4)),
                "value_usd": float(round(current_value, 2)),
                "performance_pct": float(round(performance_pct, 2)),
                "price_24h_ago": float(round(price_24h_ago, 4)),
                "change_24h_usd": float(round(change_24h_usd, 2)),
                "performance_pct_24h": float(round(performance_24h, 2)),
            }
        )

    # Calcula % do portfólio
    for a in assets_data:
        a["percentage"] = (
            (a["value_usd"] / float(total_balance) * 100)
            if total_balance > 0
            else 0
        )

    return {"total_balance": float(total_balance), "assets": assets_data}


# Editar carteira
def update_wallet(db: Session, wallet_id: int, wallet: schemas.WalletUpdate):
    db_wallet = (
        db.query(models.Wallet).filter(models.Wallet.id == wallet_id).first()
    )
    if not db_wallet:
        raise HTTPException(status_code=404, detail="Wallet não encontrada")

    update_data = wallet.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_wallet, key, value)

    db.commit()
    db.refresh(db_wallet)
    return db_wallet


def delete_wallet(db: Session, wallet_id: int):
    db_wallet = (
        db.query(models.Wallet).filter(models.Wallet.id == wallet_id).first()
    )
    if not db_wallet:
        raise HTTPException(status_code=404, detail="Wallet não encontrada")

    db.delete(db_wallet)
    db.commit()
    return {"message": "Wallet deletada com sucesso"}
