# app/crud/transaction_crud.py
from decimal import Decimal
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app import models, schemas


def create_transaction(
    db: Session,
    transaction: schemas.TransactionCreate,
    current_user: models.User,
):
    """
    Cria uma transação e garante:
    - wallet pertence ao usuário
    - asset existe
    - price é preenchido com asset.price se não fornecido
    - atualiza (ou cria) WalletAsset.balance
    """
    # 1) valida wallet e propriedade
    wallet = db.get(models.Wallet, transaction.wallet_id)
    if not wallet or wallet.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Wallet não encontrada ou não pertence ao usuário",
        )

    # 2) valida asset
    asset = db.get(models.Asset, transaction.asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset não encontrado")

    # 3) determina preço da transação
    # (preço enviado pelo cliente ou preço atual do asset)
    price_now = Decimal(str(asset.price or 0))
    tx_price = (
        Decimal(str(transaction.price))
        if transaction.price is not None
        else price_now
    )

    # 4) cria o registro de transação
    db_tx = models.Transaction(
        wallet_id=transaction.wallet_id,
        asset_id=transaction.asset_id,
        amount=Decimal(str(transaction.amount)),
        price=tx_price,
        type=transaction.type,
        description=transaction.description,
        tx_hash=transaction.tx_hash,
    )
    db.add(db_tx)

    # 5) atualiza ou cria WalletAsset balance
    wa = (
        db.query(models.WalletAsset)
        .filter(models.WalletAsset.wallet_id == transaction.wallet_id)
        .filter(models.WalletAsset.asset_id == transaction.asset_id)
        .with_for_update(of=models.WalletAsset)
        .first()
    )

    if not wa:
        wa = models.WalletAsset(
            wallet_id=transaction.wallet_id,
            asset_id=transaction.asset_id,
            balance=Decimal(0),
        )
        db.add(wa)
        # flush para garantir que wa tem id se necessário
        db.flush()

    # 6) aplicar efeito no balance conforme tipo
    if transaction.type == models.TransactionType.BUY:
        wa.balance = (Decimal(wa.balance) or Decimal(0)) + Decimal(
            str(transaction.amount)
        )
    elif transaction.type == models.TransactionType.SELL:
        wa.balance = (Decimal(wa.balance) or Decimal(0)) - Decimal(
            str(transaction.amount)
        )
        # opcional: prevenir balance negativo
        # aqui apenas permitimos (você decide política)
    # outros tipos (deposit/withdraw) podem ser tratados diferente

    db.commit()
    db.refresh(db_tx)
    return db_tx


def get_transaction(db: Session, transaction_id: int):
    return db.query(models.Transaction).get(transaction_id)


def update_transaction(
    db: Session, transaction_id: int, transaction: schemas.TransactionCreate
):
    """
    Implementação mínima: atualiza descrição/tx_hash e 
    NÃO altera o histórico financeiro.
    (Se quiser permitir edits que alterem quantidade/tipo,
    precisa de lógica para re-calcular WalletAsset.)
    """
    db_tx = db.query(models.Transaction).get(transaction_id)
    if not db_tx:
        return None

    up = transaction.dict(exclude_unset=True)
    # evitar alteração de campos sensíveis aqui 
    # (wallet_id, asset_id, price, amount, type) sem regra
    for key in ("description", "tx_hash"):
        if key in up:
            setattr(db_tx, key, up[key])

    db.commit()
    db.refresh(db_tx)
    return db_tx


def delete_transaction(db: Session, transaction_id: int):
    db_tx = db.query(models.Transaction).get(transaction_id)
    if not db_tx:
        return None

    # Observação: remover uma transação deve recomputar saldo 
    # se você quer manter consistência.
    # Aqui vamos aplicar efeito reverso simples (cuidado em produção)
    if db_tx.type == models.TransactionType.BUY:
        # subtrai o amount do balance
        wa = (
            db.query(models.WalletAsset)
            .filter(models.WalletAsset.wallet_id == db_tx.wallet_id)
            .filter(models.WalletAsset.asset_id == db_tx.asset_id)
            .first()
        )
        if wa:
            wa.balance = (Decimal(wa.balance) or Decimal(0)) - Decimal(
                str(db_tx.amount)
            )
    elif db_tx.type == models.TransactionType.SELL:
        wa = (
            db.query(models.WalletAsset)
            .filter(models.WalletAsset.wallet_id == db_tx.wallet_id)
            .filter(models.WalletAsset.asset_id == db_tx.asset_id)
            .first()
        )
        if wa:
            wa.balance = (Decimal(wa.balance) or Decimal(0)) + Decimal(
                str(db_tx.amount)
            )

    db.delete(db_tx)
    db.commit()
    return db_tx
