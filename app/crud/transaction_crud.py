# app/crud/transaction_crud.py
from decimal import Decimal
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app import models, schemas


def _to_tx_type(value) -> models.TransactionType:
    """
    Normaliza o tipo vindo do schema (string ou enum) para TransactionType.
    Levanta ValueError se inválido.
    """
    if isinstance(value, models.TransactionType):
        return value
    if isinstance(value, str):
        try:
            return models.TransactionType(value.lower())
        except ValueError:
            # tenta aceitar também valores já em lower/upper/Title,
            # mas TransactionType() cuida disso
            raise
    raise ValueError("Tipo de transaction inválido")


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
    Retorna o objeto Transaction persistido.
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
        if getattr(transaction, "price", None) is not None
        else price_now
    )

    # 4) normaliza o tipo para enum TransactionType
    try:
        tx_type = _to_tx_type(transaction.type)
    except Exception:
        raise HTTPException(
            status_code=400, detail="Tipo de transação inválido"
        )

    # 5) cria o objeto Transaction (sem commit ainda)
    db_tx = models.Transaction(
        wallet_id=transaction.wallet_id,
        asset_id=transaction.asset_id,
        amount=Decimal(str(transaction.amount)),
        price=tx_price,
        type=tx_type,
        description=transaction.description,
        tx_hash=transaction.tx_hash,
    )

    try:
        db.add(db_tx)
        # flush para garantir que o INSERT
        # seja executado e o objeto tenha PK sem commitar
        db.flush()

        # 6) atualiza ou cria WalletAsset balance (com lock pessimista)
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
            db.flush()  # garante que wa está persistido

        # 7) aplicar efeito no balance conforme tipo
        # (usar tx_type já normalizado)
        current_balance = Decimal(wa.balance or 0)
        amt = Decimal(str(transaction.amount))

        if tx_type == models.TransactionType.BUY:
            wa.balance = current_balance + amt
        elif tx_type == models.TransactionType.SELL:
            wa.balance = current_balance - amt
            # Nota: política de permitir saldo negativo fica a seu critério.
            # Se quiser impedir, faça uma checagem aqui e
            # lance HTTPException(status_code=400).
        elif tx_type in (
            models.TransactionType.DEPOSIT,
            models.TransactionType.WITHDRAW,
        ):
            # trate depósitos/retiradas conforme sua regra de negócio
            # Exemplo simples:
            if tx_type == models.TransactionType.DEPOSIT:
                wa.balance = current_balance + amt
            else:
                wa.balance = current_balance - amt

        # 8) refresh para garantir que db_tx atualize campos gerados
        # (timestamp, id, etc.)
        db.refresh(db_tx)

        # 9) commit final
        db.commit()
        # refresh final para garantir consistência depois do commit
        db.refresh(db_tx)
        return db_tx

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Erro ao criar transação: {e}"
        )


def get_transaction(
    db: Session, transaction_id: int
) -> Optional[models.Transaction]:
    return db.get(models.Transaction, transaction_id)


def update_transaction(
    db: Session, transaction_id: int, transaction: schemas.TransactionCreate
) -> Optional[models.Transaction]:
    """
    Atualiza campos não financeiros da transação (ex: description, tx_hash).
    Não altera quantidade/price/type por padrão
    (isso exigiria reprocessar saldos).
    """
    db_tx = db.get(models.Transaction, transaction_id)
    if not db_tx:
        return None

    up = transaction.dict(exclude_unset=True)

    # apenas campos seguros para alterar sem recalcular histórico
    allowed = ("description", "tx_hash")
    changed = False
    for key in allowed:
        if key in up:
            setattr(db_tx, key, up[key])
            changed = True

    if changed:
        db.commit()
        db.refresh(db_tx)
    return db_tx


def delete_transaction(
    db: Session, transaction_id: int
) -> Optional[models.Transaction]:
    """
    Deleta a transação e aplica um ajuste simples no WalletAsset
    (efeito reverso).
    Em produção é recomendado recomputar
    posições inteiras ao remover uma transação.
    """
    db_tx = db.get(models.Transaction, transaction_id)
    if not db_tx:
        return None

    try:
        # efeito reverso simples
        wa = (
            db.query(models.WalletAsset)
            .filter(models.WalletAsset.wallet_id == db_tx.wallet_id)
            .filter(models.WalletAsset.asset_id == db_tx.asset_id)
            .with_for_update(of=models.WalletAsset)
            .first()
        )

        if wa:
            current_balance = Decimal(wa.balance or 0)
            amt = Decimal(str(db_tx.amount))

            if db_tx.type == models.TransactionType.BUY:
                wa.balance = current_balance - amt
            elif db_tx.type == models.TransactionType.SELL:
                wa.balance = current_balance + amt
            elif db_tx.type == models.TransactionType.DEPOSIT:
                wa.balance = current_balance - amt
            elif db_tx.type == models.TransactionType.WITHDRAW:
                wa.balance = current_balance + amt

        db.delete(db_tx)
        db.commit()
        return db_tx
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Erro ao deletar transação: {e}"
        )
