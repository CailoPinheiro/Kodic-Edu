# Kodic Edu — Ecossistema Fullstack Unificado (Next.js + Tailwind + shadcn/ui)

O **Kodic Edu** é uma plataforma educacional gamificada projetada para transformar o smartphone na sala de aula em um motor de colaboração inclusiva e aprendizagem ativa, eliminando a dependência do modelo 1:1 (um celular por aluno) e reduzindo a sobrecarga docente com IA ancorada na BNCC oficial.

A aplicação adota uma arquitetura Fullstack moderna e unificada em **Next.js 14**:
- **Front-end:** Next.js (App Router) + Tailwind CSS + shadcn/ui + Lucide Icons (Design System Glassmorphism com suporte a Dark/Light Theme).
- **Back-end:** Next.js Route Handlers (`/api/*`) com execução de alta performance no mesmo processo.
- **Banco de Dados:** SQLite relacional local (`better-sqlite3`) com modo WAL (Write-Ahead Logging), chaves estrangeiras e integridade referencial.
- **Autenticação & Segurança:** JWT assinado com controle de acesso baseado em papéis (RBAC para **Professor** e **Aluno**) e conformidade nativa com a LGPD (Privacy by Design).

---

## Principais Funcionalidades

1. **Modo Compartilhado (4 em 1):** 1 único smartphone sincroniza e atende um grupo de até 4 estudantes.
2. **Sincronização Justa de Pontos (Fair Sync):** Respostas certas no aparelho distribuem pontos igualmente para todos os membros e creditam a Meta Coletiva da Turma.
3. **Rodízio de Aparelho:** Alternância sugerida em tempo real para evitar monopólio do dispositivo.
4. **Múltiplas Inteligências:** Alunos escolhem papéis colaborativos sem exposição forçada (**Curadores**, **Revisores**, **Comunicadores**).
5. **Resolução Híbrida (Caderno Físico):** Envio e catalogação de fotos de resoluções manuscritas e mapas mentais feitos no papel.
6. **Impacto Silencioso (Gratidão Privada):** Eliminação de likes públicos, seguidores e disputa de atenção em favor de notificações privadas de utilidade coletiva.
7. **Assistente Docente BNCC Oficial:** Geração instantânea de quizzes com 0% de risco de alucinação, ancorados no catálogo oficial da BNCC (`bncc.dev` / MEC).
8. **Learning Analytics Heatmap:** Mapa de calor pedagógico por competência curricular sem monitoramento invasivo de telas.
9. **Fila de Moderação em Camadas:** Filtro de segurança por IA somado à validação distribuída por Líderes de Turma e docentes.
10. **Modo Foco & Pomodoro:** Temporizador de 25 minutos com silenciamento de notificações para atenção total.
11. **Onboarding Progressivo do Docente:** Nível 1 (Quizzes rápidos), Nível 2 (Líderes de Turma) e Nível 3 (Sala de Aula Invertida).

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

O projeto possui uma suíte completa de testes de integração ponta a ponta que valida:
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

## Estrutura do Projeto Next.js (100% TypeScript)

```
kodicedu/
├── package.json              # Configurações e scripts (Next.js 14, Tailwind, shadcn)
├── next.config.js            # Configuração Next.js (better-sqlite3 & alias)
├── tailwind.config.js        # Paleta de cores Kodic Edu (purple, fuchsia, amber, green)
├── postcss.config.js         # PostCSS com Tailwind e Autoprefixer
├── tsconfig.json             # Configuração TypeScript (@/* -> ./src/*)
├── data/
│   └── kodicedu.db           # Banco SQLite local (WAL mode)
├── test/
│   └── api.test.js           # Suíte de testes automatizados
└── src/
    ├── app/
    │   ├── api/              # Route Handlers do Back-end Next.js (route.ts)
    │   │   ├── auth/         # Login, registro, me, quick-login, perfil, LGPD
    │   │   ├── classes/      # Turmas, metas, onboarding docente
    │   │   ├── groups/       # Grupos 4-em-1, rodízio de aparelho
    │   │   ├── quizzes/      # Quizzes, submissão Fair Sync, gerador IA BNCC
    │   │   ├── content/      # Cadernos híbridos, comunicados, heatmap, impacto
    │   │   └── health/       # Health check da aplicação
    │   ├── globals.css       # Estilos globais e tokens de cores
    │   ├── layout.tsx        # Root Layout com AuthProvider e ThemeProvider
    │   └── page.tsx          # Mockup de smartphone com visão Aluno e Docente
    ├── components/
    │   ├── ui/               # Componentes shadcn/ui (Button, Card, Badge, Input, Progress)
    │   ├── Header.tsx        # Cabeçalho com alternador de tema e perfil
    │   ├── Drawer.tsx        # Menu lateral com perfil de inteligência e foco
    │   ├── AuthView.tsx      # Autenticação com tabs de login, registro e 1-clique
    │   ├── student/          # Componentes da visão do estudante (.tsx)
    │   │   ├── StudentHome.tsx
    │   │   ├── StudentGroup.tsx
    │   │   ├── StudentMissions.tsx
    │   │   ├── StudentImpact.tsx
    │   │   └── StudentFocus.tsx
    │   └── teacher/          # Painel docente (.tsx)
    │       └── TeacherDashboard.tsx
    ├── context/
    │   ├── AuthContext.tsx   # Estado global de autenticação e RBAC
    │   └── ThemeContext.tsx  # Tokens visuais e tema escuro/claro
    └── lib/
        ├── db.ts             # Conexão SQLite tipada (WAL e foreign keys)
        ├── seed.ts           # Seed pedagógico idempotente
        ├── auth.ts           # JWT e hashing com bcryptjs
        ├── bnccService.ts    # Catálogo de 1.721 habilidades BNCC
        ├── moderationService.ts # Filtro de moderação por IA
        └── utils.ts          # Utilitário cn (clsx + tailwind-merge)
```

