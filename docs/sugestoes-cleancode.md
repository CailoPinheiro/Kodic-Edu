# Sugestões de Clean Code: Kodic Edu

Levantamento feito durante a reorganização em `backend/`/`frontend/` (ver [`arquitetura.md`](./arquitetura.md)). Os itens 1 a 5 e 7 a 8 seguem não aplicados; o item 6 (código morto) já foi removido.

## 1. Segurança: segredo de JWT com fallback hardcoded

`backend/auth.ts:4`
```ts
const JWT_SECRET = process.env.JWT_SECRET || 'kodic_edu_secret_jwt_key_2026';
```
Se `JWT_SECRET` não estiver definido no ambiente, a aplicação sobe com um segredo fixo e público (está neste arquivo, versionado). Qualquer pessoa com acesso ao repositório consegue forjar tokens válidos.

**Sugestão:** falhar explicitamente se a env var não existir (`if (!process.env.JWT_SECRET) throw new Error(...)`), ou pelo menos gerar um valor aleatório por processo em desenvolvimento e documentar a exigência em produção (`.env.example`).

## 2. Duplicação: boilerplate de auth repetido em quase toda rota

Praticamente todo `src/app/api/**/route.ts` começa com:
```ts
const user = getAuthUser(request);
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```
(20 rotas repetem isso, por exemplo `quizzes/submit`, `groups/route.ts`, `content/moderation/route.ts`.)

**Sugestão:** extrair um wrapper em `backend/auth.ts`, por exemplo:
```ts
export function withAuth(handler: (req: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (req: NextRequest) => {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return handler(req, user);
  };
}
```
Cada `route.ts` passaria a usar `export const POST = withAuth((req, user) => { ... })`. Reduz linhas repetidas por rota e centraliza qualquer mudança futura na checagem de auth.

## 3. Sem tratamento de erro nas rotas

Nenhum `route.ts` tem `try/catch`. Uma query SQL malformada ou um `request.json()` de corpo vazio/inválido viram um 500 genérico do Next, sem log estruturado nem corpo de erro previsível para o front-end.

**Sugestão:** um helper simples de handler (pode ser combinado com o `withAuth` acima) que captura exceções, devolve `{ error: string }` com status 500 e loga no servidor.

## 4. Tipagem fraca (`any` espalhado) num projeto TypeScript

`backend/auth.ts`, `backend/seed.ts` e praticamente toda rota usam `as any` para o resultado de `db.prepare(...).get()/.all()` (por exemplo `quizzes/submit/route.ts:18,29,44,75,76`). O projeto está em TypeScript mas não tipa as linhas do banco, perdendo autocomplete e checagem de campo errado ou renomeado.

**Sugestão:** declarar interfaces para as tabelas principais (`User`, `Class`, `Group`, `Quiz`) em `backend/types.ts` e usar `db.prepare(...).get() as User | undefined` em vez de `any`. Não precisa de um ORM; só as `interface` já eliminam a maior parte do risco.

## 5. Lógica de domínio dentro do handler HTTP

`src/app/api/quizzes/submit/route.ts` (linhas 23 a 73) calcula pontuação, bônus de "dono do aparelho" e distribuição de pontos para o grupo inteiro dentro do próprio `route.ts`. É regra de negócio (a "Sincronização Justa de Pontos", uma das funcionalidades centrais do produto) misturada com parsing de request/response HTTP.

**Sugestão:** mover esse cálculo para uma função em `backend/services/` (por exemplo `quizService.ts:submitAnswer(user, quizId, chosenIndex)`), deixando o `route.ts` só validar input e chamar o serviço. Fica testável sem precisar simular um `NextRequest`.

## 6. Código morto (já removido)

- `frontend/components/student/StudentFocus.tsx`: Pomodoro não usado, a versão real do Modo Foco já vive em `Drawer.tsx`. Removido.
- `frontend/components/ui/{badge,button,card,input,progress}.tsx`: shadcn-style, sem nenhum import. Removidos.
- Como consequência, `frontend/lib/utils.ts` (helper `cn()`) ficou sem nenhum uso e também foi removido.
- `clsx` e `tailwind-merge` continuam no `package.json`, mas não são mais importados por nada. Podem ser removidos das dependências (`npm uninstall clsx tailwind-merge`) se não forem usados de novo em breve.

## 7. Higiene do repositório

- Havia um `kodicedu.db` (binário SQLite) commitado na raiz do repositório, apesar do `.gitignore` já cobrir `data/*.db*`. Provavelmente um `git add .` acidental antes do gitignore existir. Removido nesta reorganização; vale rodar `git log --all --oneline -- kodicedu.db` para confirmar quando entrou e evitar reintroduzir binário de banco no histórico.
- `.gitignore` tinha uma regra `server/data/*.db*` órfã, do backend Express antigo que foi removido. Já limpa.

## 8. `seed.ts` como um único arquivo de 390 linhas

`backend/seed.ts` mistura dados de mock (nomes, badges, textos de quiz) com a lógica de inserção condicional. Não é urgente para um seed de demo, mas se crescer mais vale separar em `backend/seed/data.ts` (os objetos/arrays) e `backend/seed/index.ts` (a lógica de `ensureSeeded`).

---

Nenhuma dessas mudanças foi aplicada; são sugestões para avaliar prioridade. As de maior risco real são o item 1 (segredo JWT) e o item 3 (sem tratamento de erro), por afetarem produção diretamente. O restante é organização e manutenibilidade.
