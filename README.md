# BunkerWallet

BunkerWallet e uma carteira digital para registrar transacoes de criptoativos e
acompanhar saldo, historico, graficos e precos de mercado em tempo quase real.

## Stack

- Backend: FastAPI, SQLAlchemy, Alembic e PostgreSQL.
- Frontend: React, TypeScript, Vite, React Query e Recharts.
- Mercado: CoinGecko via API HTTP e WebSocket interno do backend.

## Requisitos

- Python 3.11+
- Node.js 20+
- Docker Desktop
- Git

No Windows, abra o Docker Desktop antes de iniciar o banco. O comando
`docker info` deve responder sem erro.

No Windows, prefira o Python instalado pelo site oficial (`python.org`) e nao o
atalho da Microsoft Store. Depois de instalar, o comando abaixo deve funcionar:

```powershell
py -3.11 --version
```

Se `python` apontar para `C:\Program Files\WindowsApps\...`, desative os aliases
da Microsoft Store em `Configuracoes > Aplicativos > Configuracoes avancadas de
aplicativos > Aliases de execucao de aplicativo`, desligando `python.exe` e
`python3.exe`.

## Execucao rapida

### 1. Clonar o projeto

```bash
git clone <url-do-repositorio>
cd BunkerWallet
```

### 2. Criar `.env`

Crie um arquivo `.env` na raiz:

```env
POSTGRES_USER=wallet_user
POSTGRES_PASSWORD=wallet_pass
POSTGRES_DB=wallet_db
HOST_DB_PORT=5432

DATABASE_URL=postgresql+psycopg2://wallet_user:wallet_pass@localhost:5432/wallet_db
SECRET_KEY=troque-esta-chave-em-producao
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 3. Subir o PostgreSQL

```bash
docker compose up -d db
docker compose ps
```

### 4. Preparar o backend

Windows PowerShell:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python -m app.seeders.seed_assets
uvicorn app.main:app --reload --port 8000
```

Linux, macOS ou Git Bash:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seeders.seed_assets
uvicorn app.main:app --reload --port 8000
```

Backend:

- API: `http://127.0.0.1:8000/`
- Swagger: `http://127.0.0.1:8000/docs`
- Precos: `http://127.0.0.1:8000/market/prices?symbols=BTC,ETH,SOL`

### 5. Rodar o frontend

Abra outro terminal:

```bash
cd front-end
npm install
npm run dev
```

Frontend:

- App: `http://localhost:5173`
- API esperada pelo frontend: `http://localhost:8000`

## Fluxo minimo para testar

1. Acesse `http://localhost:5173/register`.
2. Crie um usuario.
3. Faca login.
4. Crie a primeira carteira pela API.
5. Registre uma compra em `Transacoes`.
6. Veja o saldo e grafico na Home.
7. Veja precos de mercado em `Ativos`.

### Criar a primeira carteira

No Swagger (`http://127.0.0.1:8000/docs`):

1. Execute `/auth/login`.
2. Copie o `access_token`.
3. Clique em `Authorize` e informe `Bearer SEU_TOKEN`.
4. Execute `POST /wallets/` com:

```json
{
  "name": "Minha Carteira",
  "description": "Carteira de testes"
}
```

Sem uma carteira criada, o portfolio e as transacoes nao terao onde registrar
as operacoes.

## Alternativa sem Docker

Se nao quiser usar Docker, instale PostgreSQL localmente e crie:

```sql
CREATE USER wallet_user WITH PASSWORD 'wallet_pass';
CREATE DATABASE wallet_db OWNER wallet_user;
GRANT ALL PRIVILEGES ON DATABASE wallet_db TO wallet_user;
```

Depois mantenha no `.env`:

```env
DATABASE_URL=postgresql+psycopg2://wallet_user:wallet_pass@localhost:5432/wallet_db
```

A partir dai, siga os passos do backend normalmente.

## Comandos uteis

Banco:

```bash
docker compose up -d db
docker compose logs -f db
docker compose down
```

Backend:

```bash
alembic upgrade head
python -m app.seeders.seed_assets
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd front-end
npm run dev
npm run build
npm run lint
```

## Observacoes

- A API de precos usa CoinGecko e pode sofrer limite de requisicoes.
- O WebSocket entrega atualizacoes periodicas, nao ticks de exchange.
- A criacao de carteira ainda e feita pela API/Swagger.
- Em producao, troque `SECRET_KEY` e configure variaveis de ambiente seguras.

## Licenca

Projeto sob licenca MIT.
