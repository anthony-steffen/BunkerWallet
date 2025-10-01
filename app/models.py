from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Numeric,
    Enum,
    func,
)
from sqlalchemy.orm import relationship
from .db import Base
from sqlalchemy.types import Float
import enum


# ------------------------
# ENUMS
# ------------------------
class TransactionType(enum.Enum):
    BUY = "buy"
    SELL = "sell"
    DEPOSIT = "deposit"
    WITHDRAW = "withdraw"


# ------------------------
# USER
# ------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamento com Wallet
    wallets = relationship("Wallet", back_populates="owner")


# ------------------------
# WALLET
# ------------------------
class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamento inverso
    owner = relationship("User", back_populates="wallets")
    assets = relationship("WalletAsset", back_populates="wallet")
    transactions = relationship("Transaction", back_populates="wallet")


# ------------------------
# ASSET
# ------------------------
class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    symbol = Column(String, nullable=False, unique=True)
    blockchain = Column(String, nullable=True)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    price = Column(Float, nullable=True)
    quantity = Column(Float, default=0)
    market_cap = Column(Float, nullable=True)
    rank = Column(Integer, nullable=True)

    # Relacionamentos
    wallet_assets = relationship("WalletAsset", back_populates="asset")
    transactions = relationship("Transaction", back_populates="asset")
    price_history = relationship("PriceHistory", back_populates="asset")


# ------------------------
# WALLET-ASSET (associação N-N entre Wallet e Asset)
# ------------------------
class WalletAsset(Base):
    __tablename__ = "wallet_assets"

    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    balance = Column(Numeric(20, 8), default=0)  # até 20 dígitos, 8 casas
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    wallet = relationship("Wallet", back_populates="assets")
    asset = relationship("Asset", back_populates="wallet_assets")


# ------------------------
# TRANSACTION
# ------------------------
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    type = Column(
        Enum(TransactionType, name="transactiontype", create_type=False),
        nullable=False,
    )
    amount = Column(Numeric(20, 8), nullable=False)
    price_at_time = Column(Numeric(20, 8), nullable=False)
    description = Column(String, nullable=True)
    tx_hash = Column(String(200), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    wallet = relationship("Wallet", back_populates="transactions")
    asset = relationship("Asset", back_populates="transactions")


# ------------------------
# PRICE HISTORY
# ------------------------
class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    price_usd = Column(Numeric(20, 8), nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamento
    asset = relationship("Asset", back_populates="price_history")
