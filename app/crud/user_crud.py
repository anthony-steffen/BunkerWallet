from sqlalchemy.orm import Session
from app import models, schemas
from passlib.hash import bcrypt


def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = bcrypt.hash(user.password)
    data = user.model_dump(exclude={"password"})
    db_user = models.User(**data, password_hash=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()
