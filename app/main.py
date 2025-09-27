from fastapi import FastAPI
from app.routers import auth_router
from app.routers import user_router
from app.routers import wallet_router
from app.routers import asset_router
from app.routers import transaction_router
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()


app = FastAPI(title="BunkerWallet API")

# permitir seu frontend local (ajuste conforme necessário)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # porta do Vite (frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app = FastAPI(title="BunkerWallet API")

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(wallet_router.router)
app.include_router(asset_router.router)
app.include_router(transaction_router.router)


@app.get("/")
def root():
    return {"msg": "API da BunkerWallet rodando na porta 8000"}
