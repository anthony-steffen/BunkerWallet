from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import schemas, models
from app.routers.auth_router import get_current_user
from app.crud import wallet_crud
from typing import List

router = APIRouter(prefix="/wallets", tags=["Wallets"])


@router.post("/", response_model=schemas.WalletResponse)
def create_wallet(
    wallet: schemas.WalletCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # opcional: verificar duplicidade de nome para o mesmo usuário
    exists = (
        db.query(models.Wallet)
        .filter(
            models.Wallet.user_id == current_user.id,
            models.Wallet.name == wallet.name,
        )
        .first()
    )
    if exists:
        raise HTTPException(
            status_code=400, detail="Wallet com esse nome já existe"
        )

    db_wallet = models.Wallet(
        name=wallet.name,
        description=getattr(wallet, "description", None),
        user_id=current_user.id,
    )
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet


# Buscar o saldo total de todas as carteiras do usuário logado
@router.get("/", response_model=List[schemas.WalletResponse])
def list_wallets(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    return wallet_crud.get_wallets_by_user(db, current_user.id)


# buscar por wallet_id (apenas do usuário logado)
@router.get("/{wallet_id}", response_model=schemas.WalletResponse)
def get_wallet(
    wallet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    wallet = db.get(models.Wallet, wallet_id)
    if not wallet or wallet.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Wallet não encontrada")
    return wallet


@router.get("/{wallet_id}/portfolio")
def get_portfolio(
    wallet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return wallet_crud.get_portfolio_summary(db, wallet_id)
