# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
import logging
from dotenv import load_dotenv
from app.routers import (
    auth_router,
    user_router,
    wallet_router,
    asset_router,
    transaction_router,
)
from app.seeders.seed_assets import seed_assets_batch

load_dotenv()
logger = logging.getLogger("bunkerwallet")
logger.setLevel(logging.INFO)


scheduler = BackgroundScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Adiciona o job chamando a função real (callable)
    scheduler.add_job(
        seed_assets_batch,       # <<< aqui precisa ser a função, não o módulo
        "interval",
        minutes=30,
        id="seed_assets_job",
        replace_existing=True,
        max_instances=1
    )
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="BunkerWallet API", lifespan=lifespan)

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(wallet_router.router)
app.include_router(asset_router.router)
app.include_router(transaction_router.router)


@app.get("/")
def root():
    return {"msg": "API da BunkerWallet rodando na porta 8000"}
