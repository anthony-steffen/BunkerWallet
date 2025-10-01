# app/crud/transaction_crud.py

from sqlalchemy.orm import Session
from app import models, schemas


def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    data = transaction.model_dump()
    # normalizar o símbolo
    if "symbol" in data and isinstance(data["symbol"], str):
        data["symbol"] = data["symbol"].upper()
    db_transaction = models.Transaction(**data)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_transaction(db: Session, transaction_id: int):
    return (
        db.query(models.Transaction)
        .filter(models.Transaction.id == transaction_id)
        .first()
    )


def update_transaction(
    db: Session, transaction_id: int, transaction: schemas.TransactionCreate
):
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        return None
    updates = transaction.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(db_transaction, key, value)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def delete_transaction(db: Session, transaction_id: int):
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        return None
    db.delete(db_transaction)
    db.commit()
    return db_transaction
