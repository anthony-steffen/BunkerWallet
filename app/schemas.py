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


# ==============================
# Asset Schemas
# ==============================
class AssetBase(BaseModel):
    symbol: str
    name: str
    blockchain: str


class AssetCreate(BaseModel):
    name: str
    symbol: str
    blockchain: Optional[str] = None


class AssetResponse(AssetBase):
    id: int
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


class TransactionCreate(TransactionBase):
    wallet_id: int
    asset_id: int
    amount: float
    price_at_time: float
    type: TransactionType


class TransactionResponse(TransactionBase):
    id: int
    timestamp: datetime


class Config:
    from_attributes = True
