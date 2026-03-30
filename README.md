# 🎬 CineLog

> Sistema de controle de filmes e séries com autenticação, banco de dados em nuvem e pipeline de CI/CD automatizado.

---

## Objetivo da Solução

O CineLog é uma aplicação SaaS desenvolvida em React que permite ao usuário registrar, organizar e avaliar filmes e séries assistidos. Cada usuário possui uma conta própria com dados isolados no banco de dados, podendo cadastrar títulos com status de visualização, nota de 1 a 5 estrelas e comentários pessoais.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **React** | 19 | Biblioteca principal de UI |
| **TypeScript** | 5 | Tipagem estática e segurança de código |
| **Vite** | 6 | Bundler e servidor de desenvolvimento |
| **Supabase** | 2 | Autenticação e banco de dados PostgreSQL |
| **GitHub Actions** | — | Pipeline de CI/CD automatizado |

## Explicação do Workflow (ci.yml)

O arquivo `.github/workflows/ci.yml` define o pipeline de integração contínua que é executado automaticamente pelo GitHub Actions.

```yaml
name: CI — Build e Validação

# Executa o workflow em qualquer push
on:
  push:
    branches:
      - main
      - '**' # qualquer branch

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # 1️⃣ Clonar o repositório
      - name: Checkout repository
        uses: actions/checkout@v3

      # 2️⃣ Configurar Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '24'

      # 3️⃣ Instalar dependências
      - name: Install dependencies
        run: npm install

      # 4️⃣ Exibir mensagem no console
      - name: Show message
        run: echo "🚀 Iniciando CI para CineNote!"

      # 5️⃣ Rodar build do projeto React
      - name: Run build
        run: npm run build

      # 6️⃣ Listar arquivos do diretório de build
      - name: List build files
        run: ls -R dist
```

---

### Gatilhos do workflow

| Evento | Branch | Ação |
|---|---|---|
| `push` | `main` ou `develop` | Executa o pipeline completo |
| `pull_request` | `main` | Valida o build antes do merge |

---

## Fluxo de Execução do Pipeline

```
Desenvolvedor faz push ou abre PR
              │
              ▼
    GitHub Actions é acionado
              │
              ▼
┌─────────────────────────────────────┐
│  Runner: ubuntu-latest              │
│                                     │
│  1. Checkout do código          ✓   │
│              │                      │
│              ▼                      │
│  2. Setup Node.js 24 + cache    ✓   │
│              │                      │
│              ▼                      │
│  3. npm ci (instala deps)       ✓   │
│              │                      │
│              ▼                      │
│  4. Injeta variáveis (.env)     ✓   │
│              │                      │
│              ▼                      │
│  5. npm run build                   │
│     ├── tsc -b (valida tipos)   ✓   │
│     └── vite build (empacota)   ✓   │
│              │                      │
│              ▼                      │
│  6. ls dist/ (confirma build)   ✓   │
└─────────────────────────────────────┘
              │
       ┌──────┴───────┐
       ▼              ▼
   SUCESSO ✅      FALHA ❌
       │              │
  PR liberado     PR bloqueado
  para merge      até correção
```
---

## Como Rodar Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/cine-note.git
cd cine-note

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
ni .env
# Edite o .env com suas credenciais do Supabase

# 4. Rodar em desenvolvimento
npm run dev

# 5. Build de produção (mesmo comando executado no pipeline)
npm run build
```