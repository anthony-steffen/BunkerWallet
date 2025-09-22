from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas
from app.db import get_db
from app.crud import user_crud

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db=db, user=user)


@router.get("/", response_model=list[schemas.UserResponse])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_crud.get_users(db=db, skip=skip, limit=limit)
