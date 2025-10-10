from fastapi import HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy import func
from decimal import Decimal


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
    # Busca todas as transações da carteira
    transactions = (
        db.query(models.Transaction)
        .filter(models.Transaction.wallet_id == wallet_id)
        .order_by(models.Transaction.timestamp.asc())
        .all()
    )

    if not transactions:
        return {"total_balance": 0.0, "assets": []}

    assets_map = {}

    for tx in transactions:
        aid = tx.asset_id
        asset = db.query(models.Asset).filter(models.Asset.id == aid).first()

        if not asset:
            # Se o ativo não existir, ignora (proteção de integridade)
            continue

        if aid not in assets_map:
            assets_map[aid] = {
                "asset": asset,
                "quantity": Decimal(0),
                "total_cost": Decimal(0),
            }

        rec = assets_map[aid]
        amount = Decimal(tx.amount)
        tx_price = Decimal(tx.price or 0)
        tx_type = (
            tx.type.value
            if hasattr(tx.type, "value")
            else str(tx.type).lower()
        )

        if tx_type == "buy":
            rec["quantity"] += amount
            rec["total_cost"] += amount * tx_price
        elif tx_type == "sell":
            if rec["quantity"] > 0:
                avg_price = rec["total_cost"] / rec["quantity"]
                rec["quantity"] -= amount
                rec["total_cost"] -= amount * avg_price

        # Você pode adicionar suporte para deposit/withdraw aqui se desejar

    assets_data = []
    total_balance = Decimal(0)

    for rec in assets_map.values():
        asset = rec["asset"]
        quantity = rec["quantity"]
        total_cost = rec["total_cost"]

        if quantity <= 0:
            continue

        avg_price = (total_cost / quantity) if quantity > 0 else Decimal(0)
        current_price = Decimal(asset.price or 0)
        current_value = quantity * current_price
        total_balance += current_value

        performance_pct = (
            float(((current_price - avg_price) / avg_price * 100))
            if avg_price > 0
            else 0
        )

        assets_data.append(
            {
                "name": asset.name,
                "symbol": asset.symbol,
                "image": asset.image,
                "quantity": float(quantity),
                "purchase_price": float(avg_price),
                "current_price": float(current_price),
                "value_usd": float(current_value),
                "performance_pct": performance_pct,
            }
        )

    for a in assets_data:
        a["percentage"] = (
            (a["value_usd"] / float(total_balance) * 100)
            if total_balance > 0
            else 0
        )

    return {
        "total_balance": float(total_balance),
        "assets": assets_data,
    }


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
