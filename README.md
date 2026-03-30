# 🎬 CineNote

> Sistema de controle de filmes e séries com autenticação, banco de dados em nuvem e pipeline de CI/CD automatizado.

---

## Objetivo da Solução

O CineNote é uma aplicação SaaS desenvolvida em React que permite ao usuário registrar, organizar e avaliar filmes e séries assistidos. Cada usuário possui uma conta própria com dados isolados no banco de dados, podendo cadastrar títulos com status de visualização, nota de 1 a 5 estrelas e comentários pessoais.

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

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Criar arquivo .env para o build
        run: |
          echo "VITE_SUPABASE_URL=${{ secrets.VITE_SUPABASE_URL }}" >> .env
          echo "VITE_SUPABASE_ANON_KEY=${{ secrets.VITE_SUPABASE_ANON_KEY }}" >> .env

      - name: Executar build de produção
        run: npm run build

      - name: Verificar artefatos gerados
        run: ls -lh dist/
```

### Gatilhos do workflow

| Evento | Branch | Ação |
|---|---|---|
| `push` | `main` ou `develop` | Executa o pipeline completo |
| `pull_request` | `main` | Valida o build antes do merge |

### Secrets necessários no GitHub

Configure em **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anon do Supabase |

---

## Explicação do Pipeline

O pipeline é composto por uma única job (`build`) com seis etapas sequenciais. Se qualquer etapa falhar, as seguintes são canceladas e o pipeline é marcado como falho — impedindo que código quebrado seja mergeado.

### Etapa 1 — Checkout
```yaml
uses: actions/checkout@v4
```
Clona o repositório dentro do runner (máquina virtual Ubuntu fornecida pelo GitHub). Sem esta etapa, nenhum arquivo do projeto estaria disponível para as etapas seguintes.

### Etapa 2 — Configurar Node.js
```yaml
uses: actions/setup-node@v4
with:
  node-version: 20
  cache: 'npm'
```
Instala o Node.js 20 LTS no runner e ativa o cache do npm. O cache armazena a pasta `node_modules` entre execuções, reduzindo o tempo de instalação de dependências em pipelines subsequentes.

### Etapa 3 — Instalar dependências
```yaml
run: npm ci
```
Usa `npm ci` em vez de `npm install`. A diferença é importante: `npm ci` instala exatamente as versões travadas no `package-lock.json`, garantindo um ambiente reproduzível e idêntico em toda execução do pipeline.

### Etapa 4 — Criar arquivo .env
```yaml
run: |
  echo "VITE_SUPABASE_URL=${{ secrets.VITE_SUPABASE_URL }}" >> .env
  echo "VITE_SUPABASE_ANON_KEY=${{ secrets.VITE_SUPABASE_ANON_KEY }}" >> .env
```
Injeta as variáveis de ambiente a partir dos Secrets do GitHub. O Vite precisa dessas variáveis em tempo de build para substituir as referências a `import.meta.env.VITE_*` nos arquivos compilados. Os valores nunca ficam expostos nos logs do pipeline.

### Etapa 5 — Build de produção
```yaml
run: npm run build
```
Executa `tsc -b && vite build`, que faz duas coisas em sequência:
1. **`tsc -b`** — compila o TypeScript e valida todos os tipos. Se houver erro de tipo, o pipeline falha aqui com o erro exato apontado.
2. **`vite build`** — empacota a aplicação para produção na pasta `dist/`, com minificação, tree-shaking e otimização de assets.

### Etapa 6 — Verificar artefatos
```yaml
run: ls -lh dist/
```
Lista os arquivos gerados na pasta `dist/` com seus tamanhos. Serve como confirmação visual de que os artefatos foram criados corretamente e permite monitorar o crescimento do bundle ao longo do tempo.

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
│  2. Setup Node.js 20 + cache    ✓   │
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
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# 4. Rodar em desenvolvimento
npm run dev

# 5. Build de produção (mesmo comando executado no pipeline)
npm run build
```