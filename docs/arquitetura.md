# Arquitetura: Kodic Edu

## Stack

Aplicação **fullstack única** em Next.js 14 (App Router), sem backend separado:

- **Framework:** Next.js 14 (React 18 + App Router), TypeScript
- **Estilo:** Tailwind CSS
- **Persistência:** SQLite via `better-sqlite3` (arquivo local em `data/kodicedu.db`, gerado em runtime)
- **Autenticação:** JWT (`jsonwebtoken`) + hash de senha (`bcryptjs`)

> Existiam duas outras implementações do mesmo projeto neste repositório (uma versão vanilla JS/HTML/CSS e uma versão Express + React separada em `client/`/`server/`), provavelmente vindas de merges de branches de colegas. Foram removidas por serem código morto redundante: a stack ativa (e a única referenciada pelo `package.json` da raiz) sempre foi esta versão Next.js.

## Por que `app/` não é dividido em backend/frontend

O App Router do Next.js exige que páginas e rotas de API fiquem numa única árvore (`src/app/`) para o roteamento por arquivo funcionar. Por isso `src/app/` continua no lugar que o framework exige, mas **não contém lógica**: cada `route.ts` é só um adaptador HTTP fino que chama funções de `backend/`. Componentes e páginas de `src/app/*.tsx` importam tudo de `frontend/`.

## Estrutura de pastas

```
.
├── backend/                    # lógica de domínio e acesso a dados (sem HTTP, sem React)
│   ├── db.ts                   # conexão SQLite + schema (initSchema)
│   ├── auth.ts                 # geração/validação de JWT (signToken, getAuthUser)
│   ├── seed.ts                 # seed de dados de demonstração (ensureSeeded)
│   └── services/
│       ├── bnccService.ts      # integração com a taxonomia BNCC
│       └── moderationService.ts# regras de moderação de conteúdo
│
├── frontend/                   # camada de apresentação (React), sem acesso a dados
│   ├── components/
│   │   ├── student/             # telas do papel Aluno
│   │   ├── teacher/              # telas do papel Professor
│   │   └── ui/                   # componentes de UI genéricos (shadcn-style)
│   ├── context/                 # AuthContext, ThemeContext (estado global React)
│   └── lib/
│       └── utils.ts             # helper `cn()` de merge de classes Tailwind
│
├── src/app/                     # exigido pelo Next.js App Router
│   ├── api/**/route.ts          # adaptadores HTTP finos → chamam backend/
│   ├── layout.tsx, page.tsx     # shell da aplicação → importam de frontend/
│   └── globals.css
│
├── docs/                        # documentação do projeto
├── test/                        # testes de integração da API
└── next.config.js, tsconfig.json, tailwind.config.js
```

## Aliases de import

Configurados em `tsconfig.json` (`compilerOptions.paths`, para o editor/type-check) e replicados manualmente em `next.config.js` (`webpack.resolve.alias`, pois o projeto já usava alias manual em vez de depender só do plugin automático do Next):

| Alias | Aponta para |
|---|---|
| `@/backend/*` | `./backend/*` |
| `@/frontend/*` | `./frontend/*` |
| `@/*` | `./src/*` |

Os dois primeiros aliases são resolvidos antes do genérico `@/*` (ordem importa tanto em `tsconfig.paths` quanto no `resolve.alias` do webpack).

## Fluxo de uma requisição

```
Browser → src/app/page.tsx (frontend/components/*)
        → fetch para /api/...
        → src/app/api/.../route.ts   (adaptador HTTP: parse do request, status codes)
        → backend/auth.ts             (valida JWT)
        → backend/db.ts | backend/services/*  (regra de negócio / dado)
        → route.ts devolve JSON
```

Nenhum arquivo de `frontend/` importa de `backend/` diretamente, nem o contrário. O único ponto de contato é `src/app/api/**/route.ts`.

## Débitos técnicos identificados (não corrigidos nesta reorganização)

Ver [`sugestoes-cleancode.md`](./sugestoes-cleancode.md).
