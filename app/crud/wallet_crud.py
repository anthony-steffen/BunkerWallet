from sqlalchemy.orm import Session
from app import models, schemas


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
