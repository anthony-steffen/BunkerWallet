# app/routers/asset_router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app import schemas
from app.crud import asset_crud
from app.services.coingecko import get_top_assets_cached

router = APIRouter(
    prefix="/assets",
    tags=["Assets"],
)


@router.get("/top")
async def get_top_assets():
    """
    Retorna os 100 principais ativos de mercado (cacheado por 10 min)
    """
    try:
        assets = get_top_assets_cached()
        return assets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=schemas.AssetResponse)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db)):
    return asset_crud.create_asset(db=db, asset=asset)


@router.get("/", response_model=List[schemas.AssetResponse])
def list_assets(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return asset_crud.get_assets(db=db, skip=skip, limit=limit)


@router.get("/{asset_id}", response_model=schemas.AssetResponse)
def get_asset(asset_id: int, db: Session = Depends(get_db)):
    db_asset = asset_crud.get_asset(db=db, asset_id=asset_id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db_asset


@router.put("/{asset_id}", response_model=schemas.AssetResponse)
def update_asset(
    asset_id: int, asset: schemas.AssetCreate, db: Session = Depends(get_db)
):
    db_asset = asset_crud.update_asset(db=db, asset_id=asset_id, asset=asset)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db_asset


@router.delete("/{asset_id}", response_model=schemas.AssetResponse)
def delete_asset(asset_id: int, db: Session = Depends(get_db)):
    db_asset = asset_crud.delete_asset(db=db, asset_id=asset_id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db_asset
