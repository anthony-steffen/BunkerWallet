# app/crud/auth_crud.py
import os
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from passlib.hash import bcrypt
from sqlalchemy.orm import Session

from app import models, schemas

# Carrega do environment (.env) - load_dotenv deve ter sido chamado no main
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-super-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = bcrypt.hash(user.password)
    # Ajuste automático ao campo do seu model (password_hash / hashed_password)
    if hasattr(models.User, "password_hash"):
        db_user = models.User(
            name=user.name, email=user.email, password_hash=hashed_pw
        )
    elif hasattr(models.User, "hashed_password"):
        db_user = models.User(
            name=user.name, email=user.email, hashed_password=hashed_pw
        )
    else:
        # fallback: tenta atribuir password_hash (verifique seu models.py)
        db_user = models.User(
            name=user.name, email=user.email, password_hash=hashed_pw
        )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None

    # pega o hash armazenado de forma flexível
    stored_hash = (
        getattr(user, "password_hash", None)
        or getattr(user, "hashed_password", None)
        or getattr(user, "password", None)
    )
    if not stored_hash:
        return None

    if not bcrypt.verify(password, stored_hash):
        return None

    return user


def create_access_token(
    subject: str, expires_delta: Optional[timedelta] = None
) -> str:
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode = {"sub": str(subject), "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
