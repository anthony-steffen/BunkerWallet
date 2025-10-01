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


def get_balance(db: Session, user_id: int):
    wallets = (
        db.query(models.Wallet).filter(models.Wallet.user_id == user_id).all()
    )
    result = []
    for w in wallets:
        balance = (
            db.query(
                func.sum(
                    models.Transaction.amount
                    * models.Transaction.price_at_time
                )
            )
            .filter(models.Transaction.wallet_id == w.id)
            .scalar()
        ) or 0
        w.balance = balance
        result.append(w)
    return result
