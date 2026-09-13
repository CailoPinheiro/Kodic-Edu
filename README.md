# Kodic Edu: O Celular como Ferramenta de Engajamento Coletivo

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Hackathon](https://img.shields.io/badge/Projeto-Hackathon-8B5CF6)

---

## O Desafio do Hackathon

> Como criar soluções que permitam o uso pedagógico de dispositivos digitais pessoais, reduzindo distrações e fortalecendo o foco, a autonomia dos estudantes e a mediação dos educadores, sem ampliar a vigilância, a desigualdade ou a sobrecarga das escolas?
>
> As propostas deverão demonstrar como o celular pode deixar de ser um elemento de distração para tornar-se uma ferramenta efetiva de aprendizagem, colaboração, criatividade e bem-estar.

O Kodic Edu responde ponto a ponto:

| Exigência do desafio | Resposta do Kodic Edu |
|---|---|
| Uso pedagógico, reduzindo distração e fortalecendo o foco | Modo Foco/Pomodoro, quiz curricular no lugar de uso livre do aparelho |
| Autonomia dos estudantes | Papéis colaborativos por escolha (Curador / Revisor / Comunicador), sem exposição forçada |
| Mediação dos educadores | Assistente BNCC, Painel do Professor, Heatmap, moderação em camadas |
| Sem ampliar a vigilância | Gratidão Silenciosa (sem métricas públicas), heatmap calculado a partir de respostas de quiz, não de monitoramento de tela |
| Sem ampliar a desigualdade | Modo Compartilhado: um celular por grupo, pontuação distribuída igualmente |
| Sem ampliar a sobrecarga das escolas | Assistente de quiz ancorado na BNCC, moderação em camadas |

## O Problema

Programas de gamificação e ferramentas de engajamento escolar quase sempre assumem que **cada aluno tem um smartphone próprio**. Na realidade de muitas escolas públicas brasileiras isso não é verdade, e o resultado é que o aluno sem aparelho fica de fora da dinâmica, reforçando desigualdade em vez de reduzir. Some a isso a sobrecarga do professor pra criar conteúdo alinhado à BNCC e a fadiga de métricas de vaidade (likes, rankings públicos) que a gamificação tradicional importa das redes sociais, um uso do celular tudo menos consciente.

## A Solução e o Diferencial: Modo Compartilhado

O **Kodic Edu** responde ao desafio com uma inversão de raciocínio: em vez de tentar dar 1 celular pra cada aluno, ou de restringir o uso do aparelho, o app assume que **1 celular compartilhado por um grupo de 2 a 4 alunos** é o cenário real, e transforma isso na mecânica central do produto, não numa limitação contornada. É aí que mora o uso consciente: o celular deixa de ser ferramenta de isolamento individual e vira ferramenta de cooperação coletiva.

- Um único aparelho representa o grupo inteiro. Quando o grupo acerta uma questão, **todos os membros recebem a pontuação igualmente**: não é "o dono do celular pontua", é o grupo inteiro.
- O rodízio de quem segura o aparelho é uma mecânica visível do app, não um combinado informal entre os alunos.
- Isso é o argumento social do projeto: falta de aparelho vira motivo pra colaborar, não motivo pra ficar de fora.

Em cima dessa base, o app soma outras camadas de uso consciente: papéis colaborativos sem exposição forçada (Curador / Revisor / Comunicador), reconhecimento privado em vez de curtidas públicas ("Gratidão Silenciosa", o oposto da lógica de engajamento por vaidade das redes sociais), um assistente de quiz ancorado na BNCC pro professor não perder tempo criando conteúdo do zero, moderação em camadas pra não sobrecarregar o docente com triagem manual, e um Modo Foco (Pomodoro) que usa o próprio celular pra proteger a atenção em vez de dispersá-la.

---

## Principais Funcionalidades

1. **Modo Compartilhado (4 em 1):** 1 único smartphone sincroniza e atende um grupo de até 4 estudantes.
2. **Sincronização Justa de Pontos (Fair Sync):** Respostas certas no aparelho distribuem pontos igualmente para todos os membros e creditam a Meta Coletiva da Turma.
3. **Rodízio de Aparelho:** Alternância de quem está com o celular, persistida e visível pro grupo.
4. **Múltiplas Inteligências:** Alunos escolhem papéis colaborativos sem exposição forçada (**Curadores**, **Revisores**, **Comunicadores**).
5. **Resolução Híbrida (Caderno Físico):** Envio e catalogação de fotos de resoluções manuscritas e mapas mentais feitos no papel.
6. **Impacto Silencioso (Gratidão Privada):** Sem likes públicos, seguidores ou disputa de atenção, só notificações privadas de utilidade coletiva.
7. **Assistente Docente BNCC:** Geração de quizzes ancorados no catálogo oficial da BNCC, sem risco de alucinação.
8. **Learning Analytics Heatmap:** Mapa de calor pedagógico por competência curricular, calculado a partir das respostas reais da turma.
9. **Fila de Moderação em Camadas:** Filtro automático de conteúdo impróprio somado à validação por Líderes de Turma e docentes.
10. **Modo Foco & Pomodoro:** Temporizador de 25 minutos com silenciamento de notificações para atenção total.
11. **Onboarding Progressivo do Docente:** Nível 1 (Quizzes rápidos), Nível 2 (Líderes de Turma) e Nível 3 (Sala de Aula Invertida).
12. **Vínculo Professor e Escola:** cadastro de professor busca e vincula a escola dele (base para a futura governança institucional; ver [roadmap](./docs/requisitos/REQUISITOS.md)).

> Nem tudo acima roda com a mesma profundidade hoje: o app é um MVP de hackathon. O que é dado real (persistido, calculado dinamicamente) e o que é mock (fixo, decorativo) está mapeado item por item em [`docs/requisitos/REQUISITOS.md`](./docs/requisitos/REQUISITOS.md), com o núcleo inegociável do pitch em [`docs/requisitos/REQUISITOS-PRINCIPAIS.md`](./docs/requisitos/REQUISITOS-PRINCIPAIS.md).

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Front-end** | Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + Lucide Icons |
| **Back-end** | Next.js Route Handlers (`/api/*`), no mesmo processo do front-end |
| **Banco de Dados** | SQLite (`better-sqlite3`), modo WAL, chaves estrangeiras |
| **Autenticação** | JWT assinado + `bcryptjs`, RBAC (Professor / Aluno) |
| **Conformidade** | Privacy by Design, alinhado à LGPD |

> **Sobre a escolha da stack:** SQLite local, autenticação simplificada e sincronização por polling foram decisões pragmáticas para as 48h de hackathon, não a visão final do produto. O Kodic Edu é pensado como um app a ser desenvolvido de verdade, e essas escolhas devem ser revistas (banco relacional gerenciado, sincronização em tempo real via Supabase/Firebase, governança institucional por escola) em oportunidades futuras de aprofundamento. Ver o roadmap em [`docs/requisitos/REQUISITOS.md`](./docs/requisitos/REQUISITOS.md).

---

## Arquitetura

O código é organizado em `backend/` (regra de negócio e acesso a dados) e `frontend/` (componentes React e contexto), com `src/app/` reservado só para as rotas do Next.js (páginas + API), que funcionam como adaptadores finos chamando `backend/`. O porquê dessa separação e o fluxo completo de uma requisição estão documentados em [`docs/arquitetura.md`](./docs/arquitetura.md).

```
Kodic-Edu/
├── backend/                  # lógica de domínio e acesso a dados (sem HTTP, sem React)
│   ├── db.ts                 # conexão SQLite + schema
│   ├── auth.ts                # JWT (signToken, getAuthUser)
│   ├── seed.ts                 # seed idempotente (usuários, turma, escolas demo)
│   └── services/
│       ├── bnccService.ts      # catálogo BNCC + geração de quiz
│       └── moderationService.ts# filtro de moderação de conteúdo
│
├── frontend/                 # camada de apresentação (React), sem acesso a dados
│   ├── components/
│   │   ├── student/            # telas do papel Aluno
│   │   ├── teacher/             # telas do papel Professor
│   │   └── AuthView.tsx, Drawer.tsx, Header.tsx, ResponsiveDeviceBar.tsx
│   └── context/                # AuthContext, ThemeContext
│
├── src/app/                  # exigido pelo Next.js App Router
│   ├── api/
│   │   ├── auth/                # login, registro, quick-login, perfil
│   │   ├── classes/              # turmas, metas, onboarding docente
│   │   ├── groups/                # grupos 4-em-1, rodízio de aparelho
│   │   ├── quizzes/                # quizzes, submissão Fair Sync, gerador BNCC
│   │   ├── content/                # cadernos híbridos, comunicados, heatmap, impacto
│   │   ├── schools/                 # busca de escola pro cadastro do professor
│   │   └── health/
│   ├── layout.tsx, page.tsx, globals.css
│
├── docs/                     # arquitetura, sugestões de clean code, requisitos
├── test/                     # testes de integração da API
└── next.config.js, tsconfig.json, tailwind.config.js
```

---

## Pré-requisitos

- **Node.js:** Versão 18, 20 ou 22 instalada (`node -v`)
- **npm:** Versão 9+ instalada (`npm -v`)

---

## Instalação Rápida

Na raiz do projeto:

```bash
npm install
```

---

## Como Rodar Localmente

### Opção A: Modo Desenvolvimento (com Hot-Reload)

```bash
npm run dev
```

Acesse no navegador:
👉 **`http://localhost:3000`**

---

### Opção B: Modo Produção (Compilado e Otimizado)

```bash
# 1. Compilar Next.js (SSG + SSR + Route Handlers)
npm run build

# 2. Iniciar servidor Next.js na porta 3000
npm start
```

Acesse no navegador:
👉 **`http://localhost:3000`**

---

## Como Rodar no ngrok (Acesso pelo Smartphone)

Com o servidor rodando na porta 3000:

```bash
ngrok http 3000
```

Copie a URL pública HTTPS gerada pelo ngrok (ex: `https://xxxx.ngrok-free.app`) e abra diretamente no navegador do celular.

---

## Testes Automatizados

O projeto possui uma suíte de testes de integração ponta a ponta que valida:
- Health check da API
- Quick-login de Estudante e Professora
- Consulta de turmas e metas coletivas
- Modo compartilhado 4-em-1 e rodízio de posse
- Quizzes e Fair Sync de pontuação coletiva
- Gerador de desafios com IA BNCC
- Mapa de calor de aprendizagem (Heatmap)
- Notificações de impacto privado

Para rodar os testes:

```bash
npm test
```

---

## Credenciais de Demonstração (Seed Automático)

O banco SQLite é populado automaticamente na primeira execução com dados pedagógicos:

| Papel | E-mail | Senha | Detalhes |
|---|---|---|---|
| **Professora** | `professora@kodic.edu` | `senha123` | Profª. Cláudia Mendes (Geografia & História) |
| **Aluno (Líder / Curador)** | `alex@kodic.edu` | `senha123` | Alex Silva (Dono do aparelho no rodízio 4-em-1) |
| **Aluna (Revisor)** | `bia@kodic.edu` | `senha123` | Bia Santos |
| **Aluna (Comunicador)** | `carla@kodic.edu` | `senha123` | Carla Dias |
| **Aluno (Curador)** | `diego@kodic.edu` | `senha123` | Diego Alves |

> 💡 **Dica:** Na tela de autenticação, você também pode clicar nos botões de **"Acesso Rápido de Demonstração (1 Clique)"** para alternar instantaneamente entre a Professora e o Aluno sem precisar digitar senhas.

---

## Documentação

- [`docs/arquitetura.md`](./docs/arquitetura.md): estrutura de pastas, por que `app/` não separa em backend/frontend, fluxo de uma requisição.
- [`docs/requisitos/REQUISITOS.md`](./docs/requisitos/REQUISITOS.md): status detalhado (real vs. mock) de cada requisito funcional, e o roadmap futuro (Painel da Escola, IA real, sincronização via Supabase/Firebase).
- [`docs/requisitos/REQUISITOS-PRINCIPAIS.md`](./docs/requisitos/REQUISITOS-PRINCIPAIS.md): o núcleo inegociável do pitch, o que não pode falhar na demo.
- [`docs/sugestoes-cleancode.md`](./docs/sugestoes-cleancode.md): pontos de melhoria de código levantados (segurança, duplicação, tipagem).
