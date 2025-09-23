from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime


class WalletBase(BaseModel):
    name: str


class WalletCreate(WalletBase):
    user_id: int


class WalletResponse(WalletBase):
    id: int
    user_id: int
    created_at: datetime


class AssetBase(BaseModel):
    symbol: str
    name: str
    blockchain: str


class AssetCreate(AssetBase):
    pass


class AssetResponse(AssetBase):
    id: int
    created_at: datetime


class Config:
    from_attributes = True
