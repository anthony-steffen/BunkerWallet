from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app import schemas
from app.crud import wallet_crud

router = APIRouter(prefix="/wallets", tags=["Wallets"])


@router.post("/", response_model=schemas.WalletResponse)
def create_wallet(wallet: schemas.WalletCreate, db: Session = Depends(get_db)):
    return wallet_crud.create_wallet(db=db, wallet=wallet)


@router.get("/{user_id}", response_model=list[schemas.WalletResponse])
def list_wallets(user_id: int, db: Session = Depends(get_db)):
    return wallet_crud.get_wallets_by_user(db=db, user_id=user_id)
