from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy import func


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
    # Pegar todas as transações da carteira
    transactions = (
        db.query(
            models.Transaction.asset_id,
            func.sum(models.Transaction.amount).label("quantity"),
        )
        .filter(models.Transaction.wallet_id == wallet_id)
        .group_by(models.Transaction.asset_id)
        .all()
    )

    if not transactions:
        return {"total_balance": 0, "assets": []}

    assets_data = []
    total_balance = 0

    for t in transactions:
        asset = (
            db.query(models.Asset)
            .filter(models.Asset.id == t.asset_id)
            .first()
        )
    if not asset:
        pass

    current_value = float(t.quantity or 0) * float(asset.price or 0)
    total_balance += current_value

    assets_data.append(
        {
            "name": asset.name,
            "symbol": asset.symbol,
            "image": asset.image,
            "quantity": t.quantity,
            "current_price": asset.price,
            "value_usd": current_value,
        }
    )

    # calcular percentual
    for a in assets_data:
        a["percentage"] = (
            (a["value_usd"] / total_balance * 100) if total_balance > 0 else 0
        )

    return {"total_balance": total_balance, "assets": assets_data}
