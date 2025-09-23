# app/routers/transaction_router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app import schemas
from app.crud import transaction_crud

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate, db: Session = Depends(get_db)
):
    return transaction_crud.create_transaction(db=db, transaction=transaction)


@router.get("/", response_model=List[schemas.TransactionResponse])
def list_transactions(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return transaction_crud.get_transactions(db=db, skip=skip, limit=limit)


@router.get("/{transaction_id}", response_model=schemas.TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = transaction_crud.get_transaction(
        db=db, transaction_id=transaction_id
    )
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction


@router.put("/{transaction_id}", response_model=schemas.TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
):
    db_transaction = transaction_crud.update_transaction(
        db=db, transaction_id=transaction_id, transaction=transaction
    )
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction


@router.delete("/{transaction_id}", response_model=schemas.TransactionResponse)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = transaction_crud.delete_transaction(
        db=db, transaction_id=transaction_id
    )
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction
