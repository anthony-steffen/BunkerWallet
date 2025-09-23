from fastapi import FastAPI
from app.routers import user_router
from app.routers import wallet_router
from app.routers import asset_router

app = FastAPI(title="BunkerWallet API")

app.include_router(user_router.router)
app.include_router(wallet_router.router)
app.include_router(asset_router.router)


@app.get("/")
def root():
    return {"msg": "API da BunkerWallet rodando 🚀"}
