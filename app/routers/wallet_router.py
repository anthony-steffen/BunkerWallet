from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import schemas, models
from app.routers.auth_router import get_current_user

router = APIRouter(prefix="/wallets", tags=["Wallets"])


@router.post("/", response_model=schemas.WalletResponse)
def create_wallet(
    wallet: schemas.WalletCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # opcional: verificar duplicidade de nome para o mesmo usuário
    exists = db.query(models.Wallet).filter(
        models.Wallet.user_id == current_user.id,
        models.Wallet.name == wallet.name
    ).first()
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


# lista as carteiras do usuário logado
@router.get("/", response_model=list[schemas.WalletResponse])
def list_wallets(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Wallet).filter(
        models.Wallet.user_id == current_user.id
        ).all()


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

