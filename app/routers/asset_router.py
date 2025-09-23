from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app import schemas
from app.crud import asset_crud

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.post("/", response_model=schemas.AssetResponse)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db)):
    return asset_crud.create_asset(db=db, asset=asset)


@router.get("/", response_model=list[schemas.AssetResponse])
def list_assets(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return asset_crud.get_assets(db=db, skip=skip, limit=limit)


@router.delete("/{asset_id}", response_model=schemas.AssetResponse)
def delete_asset(
    asset_id: int, db: Session = Depends(get_db)
):
    return asset_crud.delete_asset(db=db, asset_id=asset_id)