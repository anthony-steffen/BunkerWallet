<h1 align="center">💰 BunkerWallet</h1>

<p align="center">
  <b>Gerencie suas carteiras de ativos blockchain com segurança e praticidade</b> 🚀
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.11%2B-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## ✨ Sobre o projeto

O **BunkerWallet** é uma aplicação em **Python + FastAPI** que permite:

- 👤 Cadastro de usuários  
- 💼 Criação de carteiras vinculadas a cada usuário  
- 🪙 Registro e gerenciamento de ativos (BTC, ETH, USDT...)  
- 💹 Histórico de transações e saldos em tempo real  
- 📊 Integração futura com APIs de mercado (CoinGecko, etc.)  

---

## 🛠️ Tecnologias utilizadas

- 🐍 **Python 3.11+**  
- ⚡ **FastAPI** (Framework web assíncrono e rápido)  
- 🗄️ **PostgreSQL + Docker** (Banco de dados)  
- 🏗️ **SQLAlchemy** (ORM para mapear tabelas)  
- 🔄 **Alembic** (Controle de migrations)  
- 🔐 **Passlib (bcrypt)** (Hash de senhas)  
- 🧾 **Pydantic v2** (Validação e tipagem dos dados)

---

## ⚙️ Configuração do ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/BunkerWallet.git
cd BunkerWallet



2. Criar ambiente virtual
python -m venv .venv
# Ativar ambiente
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

3. Instalar dependências
pip install -r requirements.txt

Crie um arquivo .env na raiz do projeto com:
DATABASE_URL=postgresql+psycopg2://wallet_user:wallet_pass@localhost:5432/wallet_db

Rodar migrations
alembic upgrade head

6. Subir a API
uvicorn app.main:app --reload --port 8000


Agora acesse no navegador:

🌍 API Root → http://127.0.0.1:8000/

📖 Swagger Docs → http://127.0.0.1:8000/docs

📌 Endpoints iniciais
👤 Usuários

POST /users/ → Criar usuário

{
  "name": "Anthony",
  "email": "anthony@example.com",
  "password": "123456"
}


GET /users/ → Listar usuários

💼 Carteiras

POST /wallets/ → Criar carteira

{
  "name": "Carteira BTC",
  "user_id": 1
}


GET /wallets/{user_id} → Listar carteiras de um usuário

## 📜 Roadmap

- [x] Configuração inicial do projeto  
- [x] Banco de dados PostgreSQL + Alembic  
- [x] CRUD de usuários  
- [x] CRUD de carteiras  
- [ ] CRUD de ativos  
- [ ] CRUD de transações  
- [ ] Dashboard com saldos e histórico  
- [ ] Integração com APIs de preços  


🛡️ Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar, estudar e contribuir 🤝


---

