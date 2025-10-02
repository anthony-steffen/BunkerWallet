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
from datetime import datetime, timedelta

load_dotenv()
logger = logging.getLogger("bunkerwallet")
logger.setLevel(logging.INFO)


scheduler = BackgroundScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan handler: inicia o scheduler em background e agenda o job de seed.
    - A primeira execução é adiada (next_run_time)
    para evitar bloqueios na inicialização.
    """
    try:
        logger.info("Iniciando scheduler de background...")

        # agenda job para rodar a cada 30 minutos, primeiro run em +30s
        first_run = datetime.utcnow() + timedelta(seconds=30)

        scheduler.add_job(
            seed_assets_batch,          # callable (função importada)
            "interval",
            minutes=30,
            id="seed_assets_job",
            replace_existing=True,
            max_instances=1,
            next_run_time=first_run,    # ADIAR a primeira execução
        )

        scheduler.start()
        logger.info(
            "Scheduler iniciado. Job seed_assets agendado para %s",
            first_run.isoformat()
            )
    except Exception as e:
        logger.exception("Erro iniciando scheduler: %s", e)
        # Não interromper o app — logue e continue (se preferir, re-raise)

    try:
        yield
    finally:
        logger.info("Interrompendo scheduler...")
        try:
            scheduler.shutdown(wait=False)
            logger.info("Scheduler parado.")
        except Exception:
            logger.exception("Erro ao desligar scheduler.")


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
