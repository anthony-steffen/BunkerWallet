# app/crud/asset_crud.py
from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status


# 🔹 Cria um novo asset
def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(**asset.model_dump())
    try:
        db.add(db_asset)
        db.commit()
        db.refresh(db_asset)
        return db_asset
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset already exists",
        )


# 🔹 Lista todos os assets
def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()


def get_asset(db: Session, asset_id: int):
    return db.query(models.Asset).filter(models.Asset.id == asset_id).first()


def update_asset(db: Session, asset_id: int, asset: schemas.AssetCreate):
    db_asset = get_asset(db, asset_id)
    if not db_asset:
        return None
    updates = asset.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(db_asset, key, value)
    db.commit()
    db.refresh(db_asset)
    return db_asset


def delete_asset(db: Session, asset_id: int):
    db_asset = get_asset(db, asset_id)
    if not db_asset:
        return None
    db.delete(db_asset)
    db.commit()
    return db_asset
