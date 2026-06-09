# BunkerWallet

BunkerWallet e uma carteira digital para acompanhar criptoativos, transacoes e
saldo de portfolio com precos atualizados por API de mercado.

O projeto e dividido em duas partes:

- Backend: FastAPI, SQLAlchemy, Alembic e PostgreSQL.
- Frontend: React, TypeScript, Vite, React Query e Recharts.

## Funcionalidades atuais

- Cadastro e login de usuarios.
- Criacao de carteiras por usuario.
- Cadastro/listagem de ativos.
- Compra, venda, troca e envio/retirada de criptoativos.
- Historico de transacoes.
- Balanco de portfolio.
- Lista de mercado com precos de criptoativos.
- Integracao com CoinGecko para precos atuais.
- Endpoint WebSocket para stream de precos em tempo quase real.

## Requisitos

Antes de rodar, instale:

- Python 3.11 ou superior.
- Node.js 20 ou superior.
- Docker Desktop.
- Git.

## 1. Clonar o projeto

```bash
git clone <url-do-repositorio>
cd BunkerWallet
```

## 2. Criar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
POSTGRES_USER=wallet_user
POSTGRES_PASSWORD=wallet_pass
POSTGRES_DB=wallet_db
HOST_DB_PORT=5432

DATABASE_URL=postgresql+psycopg2://wallet_user:wallet_pass@localhost:5432/wallet_db
SECRET_KEY=troque-esta-chave-em-producao
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## 3. Subir o banco de dados

Na raiz do projeto, execute:

```bash
docker compose up -d db
```

Para conferir se o container subiu:

```bash
docker compose ps
```

## 4. Preparar o backend

Crie e ative um ambiente virtual.

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Git Bash, Linux ou macOS:

```bash
python -m venv .venv
source .venv/bin/activate
```

Instale as dependencias:

```bash
pip install -r requirements.txt
```

Rode as migrations:

```bash
alembic upgrade head
```

Popule a tabela de ativos com dados da CoinGecko:

```bash
python -m app.seeders.seed_assets
```

Observacao: a API tambem agenda uma atualizacao de ativos em background depois
que o servidor sobe, mas rodar o seeder manualmente deixa o teste inicial mais
previsivel.

## 5. Rodar a API

Com o ambiente virtual ativo:

```bash
uvicorn app.main:app --reload --port 8000
```

Links uteis:

- API: `http://127.0.0.1:8000/`
- Swagger: `http://127.0.0.1:8000/docs`
- Precos de mercado: `http://127.0.0.1:8000/market/prices?symbols=BTC,ETH,SOL`
- Historico de mercado: `http://127.0.0.1:8000/market/history/BTC?days=7`

## 6. Preparar o frontend

Abra outro terminal:

```bash
cd BunkerWallet/front-end
npm install
npm run dev
```

O Vite deve abrir em:

```text
http://localhost:5173
```

O frontend esta configurado para consumir a API em `http://localhost:8000`.

## 7. Fluxo recomendado para testar

1. Acesse `http://localhost:5173/register`.
2. Crie uma conta.
3. Faca login.
4. Crie uma carteira pelo Swagger ou por uma chamada HTTP autenticada.
5. Use a tela de transacoes para registrar compra, venda, troca ou envio.
6. Abra a Home para ver saldo, grafico e tabela do portfolio.
7. Abra a tela de ativos para acompanhar precos de mercado.

### Criar a primeira carteira pela API

Depois do login, copie o token retornado em `/auth/login` e use no Swagger pelo
botao `Authorize`, ou faca uma chamada como esta:

```bash
curl -X POST http://127.0.0.1:8000/wallets/ \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Minha Carteira\",\"description\":\"Carteira de testes\"}"
```

Sem uma carteira criada, as telas de portfolio e transacoes nao terao onde
registrar as operacoes.

## 8. Comandos uteis

Backend:

```bash
uvicorn app.main:app --reload --port 8000
alembic upgrade head
python -m app.seeders.seed_assets
```

Frontend:

```bash
cd front-end
npm run dev
npm run build
npm run lint
```

Banco:

```bash
docker compose up -d db
docker compose logs -f db
docker compose down
```

## Observacoes para interessados em testar

- A integracao de mercado usa a API publica da CoinGecko, portanto pode sofrer
  limite de requisicoes.
- O WebSocket interno entrega atualizacoes periodicas, nao ticks de exchange em
  milissegundos.
- O frontend local espera backend em `localhost:8000` e Vite em
  `localhost:5173`.
- A criacao de carteira ainda e mais direta pelo Swagger/API; esse fluxo pode
  virar uma tela dedicada em uma proxima melhoria.

## Licenca

Projeto sob licenca MIT.
