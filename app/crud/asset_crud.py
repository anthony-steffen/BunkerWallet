from sqlalchemy.orm import Session
from app import models, schemas


def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(
        symbol=asset.symbol.upper(),
        name=asset.name,
        blockchain=asset.blockchain,
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset


def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()


def delete_asset(db: Session, asset_id: int):
    db_asset = (
        db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    )
    if db_asset:
        db.delete(db_asset)
        db.commit()
        return db_asset
    else:
        return None
