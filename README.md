# 🎬 CineLog

> Sistema de controle de filmes e séries — Projeto Integrador DevOps, 2ª Unidade.

---

## Sobre o sistema

O CineLog é uma aplicação SaaS desenvolvida em React + TypeScript que permite ao usuário registrar, organizar e avaliar filmes e séries assistidos. Cada usuário possui conta própria com dados isolados, podendo cadastrar títulos com busca automática via API do TMDB, status de visualização (assistido, assistindo, quero ver), nota de 1 a 5 estrelas, pôster automático e comentários pessoais.

---

## Parte 1 — Evolução do Sistema

### Melhorias em relação à 1ª unidade

| Área | O que foi feito |
|---|---|
| **Busca de filmes** | Integração com a API do TMDB — o usuário busca pelo nome e seleciona o título real com pôster, gênero e ano preenchidos automaticamente |
| **Pôsteres** | Cards dos filmes agora exibem o pôster oficial obtido do TMDB |
| **Banco de dados** | Dois novos campos na tabela: `poster_url` e `tmdb_id` |
| **Estrutura de código** | Projeto reorganizado em camadas: `context/`, `pages/`, `lib/`, `utils/`, `components/` |
| **Docker** | Dockerfile multi-stage com Node 20 para build e Nginx Alpine para produção |
| **CI/CD** | Pipeline atualizado com dois jobs: validação de build + build e push automático da imagem Docker |
| **Kubernetes** | Adicionados `deployment.yaml` com Deployment, Service e Secret |

---

## Parte 2 — Docker

### Dockerfile

O projeto utiliza um **Dockerfile multi-stage** com dois estágios:

**Stage 1 — Builder (node:20-alpine):**
- Instala as dependências com `npm ci`
- Recebe as variáveis de ambiente via `ARG` para o build do Vite
- Gera os arquivos estáticos otimizados em `/app/dist`

**Stage 2 — Produção (nginx:alpine):**
- Usa apenas o Nginx para servir os arquivos estáticos
- Configuração customizada (`nginx.conf`) que redireciona todas as rotas para `index.html` (necessário para SPAs React)
- Imagem final leve (~25 MB) sem Node.js, sem código-fonte, sem dependências de desenvolvimento

### Como executar localmente com Docker

```bash
# Build da imagem
docker build \
  --build-arg VITE_SUPABASE_URL=sua_url \
  --build-arg VITE_SUPABASE_ANON_KEY=sua_chave \
  --build-arg VITE_TMDB_API_KEY=sua_chave_tmdb \
  -t cinelog:v2 .

# Executar o container
docker run -p 8080:80 cinelog:v2

# Acessar em: http://localhost:8080
```

### Evidência da aplicação funcionando em container

Após rodar o comando acima, o sistema fica disponível em `http://localhost:8080` com todas as funcionalidades: login, cadastro, busca TMDB, listagem de filmes e séries.

---

## Parte 3 — Versionamento de Imagens

| Versão | Tag Docker | O que representa |
|---|---|---|
| `v1` | `cinelogv1/cinelog:v1` | Entrega da 1ª unidade — sistema básico com autenticação e CRUD sem pôsteres |
| `v2` | `cinelog/cinelog:v2` | Entrega da 2ª unidade — integração TMDB, pôsteres, estrutura modular, Docker multi-stage, Kubernetes |

### O que mudou entre v1 e v2

- Adicionada integração com API do TMDB (busca de filmes e séries em tempo real)
- Cards passaram a exibir pôster oficial do filme
- Dockerfile evoluído para multi-stage (build mais leve e seguro)
- Novos campos no banco: `poster_url` e `tmdb_id`
- Pipeline CI/CD atualizado com job de build e push Docker automático
- Arquivos de Kubernetes adicionados (`deployment.yaml`)

### Por que o versionamento é importante

O versionamento de imagens permite rastrear exatamente qual código está rodando em produção, fazer rollback para uma versão anterior em caso de problema, e garantir que ambientes diferentes (desenvolvimento, staging, produção) usem versões controladas e testadas. Sem versionamento, `latest` sempre sobrescreve a imagem anterior e não é possível saber qual versão está ativa.

### Versão atual

A versão que representa a entrega desta unidade é a **`v2`**: `ieldias/cinelog:v2`

---

## Parte 4 — Container Registry

- **Docker Hub:** `https://hub.docker.com/r/ieldias/cinelog`
- **Nome da imagem:** `ieldias/cinelog`
- **Tags publicadas:** `v1`, `v2`, `latest`

### Como publicar manualmente

```bash
# Login no Docker Hub
docker login

# Tag da imagem com o nome do repositório
docker tag cinelog:v2 ieldias/cinelog:v2

# Push para o Docker Hub
docker push ieldias/cinelog:v2
docker push ieldias/cinelog:latest
```

O pipeline de CI/CD faz esse processo automaticamente a cada push na branch `main`.

---

## Parte 5 — Kubernetes Simplificado

### O que é Kubernetes

Kubernetes (K8s) é uma plataforma de orquestração de containers. Ele automatiza o processo de implantar, escalar e gerenciar aplicações em containers. Em vez de você subir um container manualmente em um servidor, você descreve o estado desejado em arquivos YAML e o Kubernetes garante que esse estado seja mantido — se um container cair, ele sobe outro automaticamente.

### O que é Pod

Pod é a menor unidade do Kubernetes. Um Pod contém um ou mais containers que compartilham a mesma rede e armazenamento. No caso do CineLog, cada Pod contém um container com a imagem `ieldias/cinelog:v2` rodando o Nginx. O Kubernetes cuida de criar e destruir Pods conforme necessário.

### O que é Deployment

Deployment é o recurso que define como os Pods devem ser criados e gerenciados. Ele especifica qual imagem usar, quantas réplicas rodar (`replicas: 2`), como fazer atualizações sem downtime e como reiniciar Pods que falharem. No `deployment.yaml` deste projeto, o Deployment garante que sempre existam 2 Pods do CineLog rodando.

### O que é Service

Service é o recurso que expõe os Pods para acesso externo ou interno. Como os Pods têm IPs que mudam quando são recriados, o Service fornece um IP e DNS fixos que redirecionam o tráfego para os Pods ativos. No CineLog, o Service do tipo `LoadBalancer` distribui as requisições dos usuários entre os 2 Pods disponíveis.

### Como o Kubernetes ajudaria o CineLog

Com Kubernetes, o CineLog teria alta disponibilidade (se um Pod cair, o outro continua atendendo), escalabilidade automática (aumentar réplicas em horários de pico), atualizações sem downtime (rolling update — sobe a nova versão antes de derrubar a antiga) e gerenciamento centralizado das variáveis de ambiente via Secrets.

### Arquitetura Kubernetes

```
                        Internet
                           │
                           ▼
                    ┌─────────────┐
                    │   Service   │  (LoadBalancer — porta 80)
                    │  cinelog-   │
                    │  service    │
                    └──────┬──────┘
                           │ distribui tráfego
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │    Pod 1    │          │    Pod 2    │
       │  ┌───────┐  │          │  ┌───────┐  │
       │  │cinelog│  │          │  │cinelog│  │
       │  │  :v2  │  │          │  │  :v2  │  │
       │  └───────┘  │          │  └───────┘  │
       └─────────────┘          └─────────────┘
              │                         │
              └────────────┬────────────┘
                           │
                    ┌─────────────┐
                    │  Deployment │  (gerencia os Pods)
                    │   cinelog   │
                    └─────────────┘
                           │
                    ┌─────────────┐
                    │   Secrets   │  (variáveis de ambiente)
                    └─────────────┘
```

---

## Parte 6 — Arquivo YAML

O arquivo `deployment.yaml` na raiz do repositório contém três recursos Kubernetes:

1. **Deployment** — define 2 réplicas do container `ieldias/cinelog:v2`, com liveness probe e limites de recursos
2. **Service** — do tipo `LoadBalancer`, expõe a aplicação na porta 80
3. **Secret** — armazena as variáveis de ambiente sensíveis (Supabase e TMDB) de forma segura

```yaml
# Trecho principal do deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cinelog
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cinelog
  template:
    spec:
      containers:
        - name: cinelog
          image: ieldias/cinelog:v2
          ports:
            - containerPort: 80
```

---

## Parte 7 — Escalabilidade

### Como o Kubernetes ajudaria com muitos usuários

Se muitos usuários acessassem o CineLog ao mesmo tempo, o Kubernetes permitiria aumentar o número de réplicas (Pods) com um único comando ou automaticamente via Horizontal Pod Autoscaler. As novas réplicas recebem parte do tráfego, distribuindo a carga e mantendo o sistema responsivo sem derrubar o que já está funcionando.

### O que significa aumentar réplicas

Aumentar réplicas significa criar mais cópias do Pod rodando ao mesmo tempo. Com `replicas: 2`, existem 2 containers do CineLog ativos. Se aumentar para `replicas: 5`, o Kubernetes sobe mais 3 Pods e o Service passa a distribuir as requisições entre os 5. Isso aumenta a capacidade de atendimento sem necessidade de servidores mais potentes.

### O que aconteceria se um Pod falhasse

O Deployment monitora continuamente os Pods. Se um Pod falhar (crash, erro de memória, etc.), o Kubernetes detecta que o número de réplicas está abaixo do desejado e automaticamente cria um novo Pod para substituí-lo. Durante esse processo, os demais Pods continuam atendendo normalmente — o usuário não percebe a falha.

---

## Parte 8 — Gerência de Configuração

### 8.1 Itens de Configuração do Projeto

| Item | Localização | Por que precisa ser controlado |
|---|---|---|
| **Código-fonte** | `src/` | É o núcleo da aplicação. Qualquer alteração impacta diretamente o comportamento do sistema. Deve ser versionado para permitir rastreabilidade e rollback |
| **Dockerfile** | `Dockerfile` | Define como a imagem é construída. Mudanças afetam o ambiente de produção inteiro. Versionar garante que o ambiente seja reproduzível |
| **nginx.conf** | `nginx.conf` | Configuração do servidor web. Um erro aqui derruba a aplicação ou quebra o roteamento do SPA |
| **README.md** | `README.md` | Documentação principal do projeto. Deve refletir sempre o estado atual do sistema para orientar a equipe e avaliadores |
| **Workflow CI/CD** | `.github/workflows/ci.yml` | Define o pipeline automatizado. Controlar versões evita que mudanças no pipeline quebrem o processo de entrega |
| **Imagem Docker** | Docker Hub | A imagem é o artefato de produção. Tags (`v1`, `v2`) garantem que se sabe exatamente o que está rodando em cada ambiente |
| **deployment.yaml** | `deployment.yaml` | Manifesto Kubernetes. Define como a aplicação roda em produção — número de réplicas, recursos, segredos. Deve ser versionado junto ao código |
| **supabase-schema.sql** | `supabase-schema.sql` | Define a estrutura do banco de dados. Alterações sem controle podem corromper dados de usuários |
| **package.json / package-lock.json** | raiz do projeto | Registram todas as dependências e suas versões exatas. Sem controle, versões diferentes podem gerar comportamentos inesperados |
| **Variáveis de ambiente** | GitHub Secrets | Contêm credenciais sensíveis. O `.env` real nunca entra no repositório |

---

### 8.2 Baseline do Projeto

**Baseline:** `v2.0`
**Nome:** CineLog — Entrega 2ª Unidade
**Data:** Junho de 2026

**Arquivos que fazem parte da baseline:**

```
CineLog v2.0
├── src/                          (código-fonte completo)
├── Dockerfile                    (multi-stage, node:20 + nginx:alpine)
├── nginx.conf                    (configuração do servidor)
├── deployment.yaml               (Deployment + Service + Secret)
├── .github/workflows/ci.yml      (pipeline CI/CD com Docker)
├── supabase-schema.sql           (schema atualizado com poster_url e tmdb_id)
├── package.json                  (dependências v2)
└── README.md                     (documentação completa)
```

**Por que essa versão é considerada estável:**
- O build TypeScript passa sem erros (`tsc -b`)
- O Vite gera os artefatos de produção sem warnings críticos
- A imagem Docker foi construída e testada localmente
- Todas as funcionalidades da 2ª unidade estão implementadas e funcionando
- O pipeline CI/CD valida automaticamente cada commit

---

### 8.3 Estratégia de Versionamento

O projeto utiliza o padrão **MAJOR.MINOR.PATCH** (Semantic Versioning):

| Segmento | Quando incrementar | Exemplo |
|---|---|---|
| **MAJOR** | Nova entrega de unidade ou mudança que quebra compatibilidade | `v1.0.0 → v2.0.0` |
| **MINOR** | Nova funcionalidade sem quebrar o que existe | `v2.0.0 → v2.1.0` |
| **PATCH** | Correção de bug ou ajuste pequeno | `v2.0.0 → v2.0.1` |

**Histórico de versões:**

| Versão | Descrição |
|---|---|
| `v1.0.0` | Entrega da 1ª unidade — sistema básico com autenticação, CRUD de filmes/séries e pipeline CI/CD |
| `v2.0.0` | Entrega da 2ª unidade — integração TMDB, pôsteres, Docker multi-stage, Kubernetes, Gerência de Configuração |

As tags Docker seguem o mesmo padrão: `ieldias/cinelog:v1`, `ieldias/cinelog:v2`.

---

### 8.4 Controle de Mudanças

**Mudança 1**
- **Descrição:** Integração com a API do TMDB para busca de filmes e séries
- **Itens impactados:** `src/lib/tmdb.ts` (novo), `src/components/MovieSearch.tsx` (novo), `src/components/MovieForm.tsx`, `src/types.ts`, `supabase-schema.sql`
- **Motivo:** Eliminar a necessidade do usuário digitar manualmente o nome do filme, reduzindo erros e melhorando a experiência
- **Impacto:** Pôsteres automáticos nos cards, gênero preenchido automaticamente, nova variável de ambiente `VITE_TMDB_API_KEY` necessária
- **Status:** Implementado e em produção (v2.0.0)

**Mudança 2**
- **Descrição:** Dockerfile evoluído para build multi-stage com Nginx
- **Itens impactados:** `Dockerfile`, `nginx.conf` (novo), `.github/workflows/ci.yml`
- **Motivo:** Reduzir o tamanho da imagem final (de ~400 MB com Node para ~25 MB com Nginx Alpine) e aumentar a segurança (imagem de produção não contém código-fonte nem Node.js)
- **Impacto:** Imagem mais leve, deploy mais rápido, pipeline atualizado com novo job de Docker
- **Status:** Implementado e em produção (v2.0.0)

**Mudança 3**
- **Descrição:** Adição do `deployment.yaml` com manifests Kubernetes
- **Itens impactados:** `deployment.yaml` (novo), `README.md`
- **Motivo:** Preparar a aplicação para execução em ambiente orquestrado, atendendo ao requisito da 2ª unidade
- **Impacto:** Aplicação documentada para Kubernetes com 2 réplicas, Service LoadBalancer e gerenciamento de secrets
- **Status:** Implementado (ambiente Kubernetes não obrigatório nesta unidade)

---

### 8.5 Solicitação de Mudança

**Título da mudança:** Adicionar funcionalidade de listas compartilhadas entre usuários

**Descrição da mudança:**
Permitir que um usuário crie uma lista pública de filmes/séries e compartilhe o link com outras pessoas, que poderão visualizar (mas não editar) a lista.

**Motivo da mudança:**
Usuários pedem uma forma de compartilhar suas recomendações com amigos sem precisar que a outra pessoa tenha conta no sistema.

**Itens de configuração impactados:**
- `supabase-schema.sql` — nova tabela `shared_lists` e nova política RLS de leitura pública
- `src/types.ts` — novo tipo `SharedList`
- `src/context/MediaContext.tsx` — novos métodos de criação e busca de listas compartilhadas
- `src/components/` — novo componente `ShareModal`
- `src/pages/Dashboard.tsx` — botão de compartilhamento nos cards
- `README.md` — documentação da funcionalidade

**Impacto técnico:**
Requer migração no banco de dados Supabase (nova tabela), novos endpoints via SDK, nova rota pública no frontend e ajuste nas políticas de Row Level Security.

**Riscos envolvidos:**
- A RLS mal configurada pode expor dados privados de outros usuários
- A nova rota pública precisa de proteção contra abuso (rate limiting)
- Migração do banco em produção pode causar downtime se não for feita com cuidado

**Prioridade:** Média

**Necessidade de testes:** Sim — testes de RLS para garantir que dados privados não sejam expostos, e testes de UI para o fluxo de compartilhamento

**Decisão:** Aprovada para implementação na versão `v2.1.0`

---

### 8.6 Auditoria de Configuração

| Item verificado | Conforme? | Observação |
|---|---|---|
| README atualizado | ✅ Sim | Contém todas as seções exigidas pela 2ª unidade |
| Dockerfile presente | ✅ Sim | Multi-stage com Node 20 e Nginx Alpine |
| nginx.conf presente | ✅ Sim | Configuração para SPA React |
| deployment.yaml presente | ✅ Sim | Contém Deployment, Service e Secret |
| Imagem Docker versionada | ✅ Sim | Tags `v1` e `v2` publicadas no Docker Hub |
| Pipeline CI/CD atualizado | ✅ Sim | Dois jobs: build/validação + Docker push |
| Baseline definida | ✅ Sim | Baseline v2.0 documentada neste README |
| Mudanças registradas | ✅ Sim | 3 mudanças registradas na seção 8.4 |
| Secrets configurados | ✅ Sim | GitHub Secrets e Vercel Env Vars configurados |
| supabase-schema.sql atualizado | ✅ Sim | Inclui `poster_url` e `tmdb_id` |

---

### 8.7 Gerência de Dependências

#### Dependências do projeto

**Produção (`dependencies`):**

| Dependência | Versão | Finalidade |
|---|---|---|
| `react` | `^19.2.4` | Biblioteca principal de UI |
| `react-dom` | `^19.2.4` | Renderização do React no navegador |
| `@supabase/supabase-js` | `^2.101.0` | SDK do Supabase (Auth + Database) |
| `bootstrap` | `^5.3.8` | Framework CSS utilitário |
| `@popperjs/core` | `^2.11.8` | Posicionamento de tooltips/dropdowns (dependência do Bootstrap) |

**Desenvolvimento (`devDependencies`):**

| Dependência | Versão | Finalidade |
|---|---|---|
| `vite` | `^8.0.0` | Bundler e servidor de desenvolvimento |
| `typescript` | `~5.9.3` | Tipagem estática |
| `@vitejs/plugin-react` | `^6.0.0` | Suporte ao React no Vite |
| `eslint` | `^9.39.4` | Linting de código |
| `@types/react` | `^19.2.14` | Tipos TypeScript para React |

**Dependências de infraestrutura:**

| Dependência | Versão | Onde é usada |
|---|---|---|
| `node` | `20-alpine` | Imagem base do stage de build (Dockerfile) |
| `nginx` | `alpine` | Imagem base do stage de produção (Dockerfile) |
| API TMDB | `v3` | Busca de filmes e séries (requisição HTTP) |

#### Onde as dependências estão registradas

- Dependências do Node.js: `package.json` (versões com `^` ou `~`) e `package-lock.json` (versões exatas — este é o arquivo que garante reprodutibilidade)
- Dependências do Docker: `Dockerfile` (tags das imagens base)

#### Risco de atualizar uma dependência sem teste

Uma atualização sem teste pode introduzir breaking changes silenciosos. Por exemplo: uma atualização do `@supabase/supabase-js` pode mudar a forma como a autenticação funciona, quebrando o login. Uma atualização do Vite pode mudar o comportamento das variáveis `VITE_*`, impedindo o build. Uma atualização do TypeScript pode tornar código válido anteriormente inválido. Em todos esses casos, o pipeline CI/CD falharia — mas só depois do commit, o que poderia bloquear deploys urgentes.

#### Como a equipe controla as atualizações

1. **`package-lock.json` versionado** — garante que todo desenvolvedor e o CI/CD usem exatamente as mesmas versões
2. **`npm ci` no pipeline** — instala as versões travadas no lock file, nunca as mais recentes
3. **Atualizações deliberadas** — usar `npm update` ou `npm install pacote@versão` conscientemente, nunca deixar o `^` resolver versões inesperadas em produção
4. **Testes no pipeline antes do merge** — toda atualização passa pelo build completo (`tsc + vite build`) antes de ir para `main`
5. **Tags fixas no Dockerfile** — usar `node:20-alpine` em vez de `node:latest` garante que a imagem base não mude entre builds

---

## Estrutura do Repositório

```
cine-note/
├── .github/
│   └── workflows/
│       └── ci.yml                 ← Pipeline CI/CD (build + Docker push)
├── src/
│   ├── lib/
│   │   ├── supabase.ts            ← Cliente Supabase
│   │   └── tmdb.ts                ← Integração TMDB API
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── MediaContext.tsx
│   │   └── ThemeContext.tsx
│   ├── components/
│   │   ├── MovieSearch.tsx        ← Busca TMDB com dropdown
│   │   ├── MovieForm.tsx
│   │   ├── MovieItem.tsx          ← Card com pôster
│   │   ├── MovieList.tsx
│   │   ├── EditModal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── StarRating.tsx
│   │   └── StatsRow.tsx
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   └── Dashboard.tsx
│   ├── utils/
│   │   └── constants.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
├── Dockerfile                     ← Multi-stage: Node 20 + Nginx Alpine
├── nginx.conf                     ← Configuração Nginx para SPA
├── deployment.yaml                ← Kubernetes: Deployment + Service + Secret
├── supabase-schema.sql            ← Schema do banco (com poster_url e tmdb_id)
├── package.json
├── package-lock.json
└── README.md
```

---

## Como Rodar Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/ieldias/CineLog.git
cd CineLog

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env
# Edite o .env com suas credenciais do Supabase e TMDB

# 4. Rodar em desenvolvimento
npm run dev

# 5. Build de produção
npm run build
```

## Como Rodar com Docker

```bash
# Build da imagem
docker build \
  --build-arg VITE_SUPABASE_URL=sua_url \
  --build-arg VITE_SUPABASE_ANON_KEY=sua_chave \
  --build-arg VITE_TMDB_API_KEY=sua_chave_tmdb \
  -t cinelog:v2 .

# Rodar o container
docker run -p 8080:80 cinelog:v2

# Acessar: http://localhost:8080
```

---

## Secrets necessários no GitHub

Configure em **Settings → Secrets and variables → Actions**:

| Secret | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anon do Supabase |
| `VITE_TMDB_API_KEY` | Chave da API do TMDB |
| `DOCKERHUB_USERNAME` | Usuário do Docker Hub |
| `DOCKERHUB_TOKEN` | Token de acesso do Docker Hub |