from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models import TransactionType


# ==============================
# User Schemas
# ==============================
class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime


# ==============================
# Authentication
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ==============================
# Wallet Schemas
# ==============================
class WalletBase(BaseModel):
    name: str


class WalletCreate(BaseModel):
    name: str
    description: Optional[str] = None


class WalletResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    user_id: int
    created_at: Optional[datetime] = None
    balance: Optional[float] = None


# ==============================
# Asset Schemas
# ==============================
class AssetBase(BaseModel):
    name: str
    symbol: str
    blockchain: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[float] = None
    created_at: datetime


class AssetCreate(BaseModel):
    name: str
    symbol: str
    blockchain: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[float] = None


class AssetResponse(BaseModel):
    id: int
    name: str
    symbol: str
    blockchain: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[float] = None
    created_at: datetime


# ==============================
# Transaction Schemas
# ==============================


class TransactionBase(BaseModel):
    wallet_id: int
    asset_id: int
    amount: float
    price_at_time: float
    type: TransactionType
    description: Optional[str] = None
    tx_hash: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    wallet_id: int
    asset_id: int
    amount: float
    price_at_time: float
    type: TransactionType
    tx_hash: Optional[str] = None  # novo
    timestamp: datetime
    asset: Optional[AssetResponse] = None
    wallet: Optional[WalletResponse] = None


class Config:
    from_attributes = True
