# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
import logging
from dotenv import load_dotenv
from datetime import datetime, timedelta

from app.routers import (
    auth_router,
    user_router,
    wallet_router,
    asset_router,
    transaction_router,
)

load_dotenv()

# ---- Configuração de logs ----
logger = logging.getLogger("bunkerwallet")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# ---- Scheduler ----
scheduler = BackgroundScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan handler: inicia o scheduler em background e agenda o job de seed.
    """
    try:
        logger.info("Iniciando scheduler de background...")

        from app.seeders.seed_assets import seed_assets  # import seguro

        first_run = datetime.utcnow() + timedelta(seconds=30)

        scheduler.add_job(
            seed_assets,
            "interval",
            minutes=30,
            id="seed_assets_job",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
            next_run_time=first_run,
        )

        scheduler.start()
        logger.info(
            f"Scheduler iniciado. Próximo run: {first_run.isoformat()}"
        )
    except Exception as e:
        logger.exception(f"Erro iniciando scheduler: {e}")

    try:
        yield
    finally:
        logger.info("Interrompendo scheduler...")
        try:
            scheduler.shutdown(wait=False)
            logger.info("Scheduler parado.")
        except Exception:
            logger.exception("Erro ao desligar scheduler.")


# ---- Inicialização do app ----
app = FastAPI(title="BunkerWallet API", lifespan=lifespan)


# 🟡 Middleware para debug de CORS
@app.middleware("http")
async def debug_origin(request, call_next):
    origin = request.headers.get("origin")
    print(f"🌐 [CORS DEBUG] Request from origin: {origin}")
    response = await call_next(request)
    return response

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
