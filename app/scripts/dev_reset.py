# app/scripts/dev_reset.py
import sys
from pathlib import Path
import traceback

# --- garantir que o projeto root esteja no sys.path ---
# Estrutura assumida: <project_root>/app/scripts/dev_reset.py
ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

print(f"[dev_reset] project root: {ROOT}")
print(f"[dev_reset] python executable: {sys.executable}")


# --- agora imports "relativos ao projeto" podem funcionar ---
def reset_db_and_seed():
    try:
        # Import alembic programaticamente
        from alembic.config import Config
        from alembic import command

        alembic_ini = ROOT / "alembic.ini"
        if not alembic_ini.exists():
            raise FileNotFoundError(
                f"Não encontrei {alembic_ini}. Está na raiz do projeto?"
            )

        alembic_cfg = Config(str(alembic_ini))
        print("[dev_reset] Alembic config:", alembic_cfg.config_file_name)

        print("[dev_reset] Fazendo downgrade -> base (se possível)...")
        try:
            command.downgrade(alembic_cfg, "base")
            print("[dev_reset] downgrade base completo.")
        except Exception as e:
            print("[dev_reset] aviso: downgrade falhou ou irrelevante:", e)

        print("[dev_reset] Fazendo upgrade -> head ...")
        command.upgrade(alembic_cfg, "head")
        print("[dev_reset] upgrade head completo.")

    except Exception as e:
        print("[dev_reset] Erro ao executar alembic:", e)
        traceback.print_exc()
        raise

    # --- localizar SessionLocal (pode estar em app.db ou app.database) ---
    SessionLocal = None
    try:
        from app.db import SessionLocal as _SessionLocal  # preferência

        SessionLocal = _SessionLocal
        print("[dev_reset] SessionLocal importado de app.db")
    except Exception:
        try:
            from app.database import SessionLocal as _SessionLocal

            SessionLocal = _SessionLocal
            print("[dev_reset] SessionLocal importado de app.database")
        except Exception:
            print(
                "[dev_reset] aviso: não localizei SessionLocal (app.db/app.database). Seeder pode requerer conexão direta."
            )

    # --- localizar o seeder ---
    seed_func = None
    try:
        # ideal: app.seeders.seed_assets.seed_assets ou app.seeders.seed_assets(seed_db)
        from app.seeders.seed_assets import seed_assets as seed_func

        print("[dev_reset] seed_assets importado de app.seeders.seed_assets")
    except Exception as e:
        print(
            "[dev_reset] aviso: não localizei app.seeders.seed_assets diretamente.",
            e,
        )
        # tentar importar como módulo alternativo
        try:
            import importlib

            module = importlib.import_module("app.seeders.seed_assets")
            if hasattr(module, "seed_assets"):
                seed_func = getattr(module, "seed_assets")
                print("[dev_reset] seed_assets encontrado via importlib")
        except Exception as ex:
            print("[dev_reset] seed_assets não encontrado:", ex)

    # --- executar seeder, com ou sem db ---
    if seed_func:
        db = None
        try:
            if SessionLocal:
                db = SessionLocal()
                print("[dev_reset] Rodando seed_assets(db)...")
                # chamar com db quando definido
                seed_func(db)
            else:
                print("[dev_reset] Rodando seed_assets() sem db...")
                seed_func()
            print("[dev_reset] Seeder executado com sucesso.")
        except Exception as e:
            print("[dev_reset] Erro ao rodar seeder:", e)
            traceback.print_exc()
            raise
        finally:
            if db:
                db.close()
    else:
        print("[dev_reset] Nenhum seeder encontrado — pulando etapa de seed.")


if __name__ == "__main__":
    try:
        reset_db_and_seed()
        print("[dev_reset] Concluído com sucesso.")
    except Exception as e:
        print("[dev_reset] Erro geral:", e)
        sys.exit(1)
