# Kodic Edu — O Celular como Ferramenta de Engajamento Coletivo

O **Kodic Edu** é uma plataforma educacional gamificada desenhada para transformar o smartphone na sala de aula em um motor de colaboração e inclusão social.

A aplicação conta com arquitetura Fullstack moderna:
- **Frontend:** React 18 + Vite + Lucide Icons (Design System com Dark/Light theme e glassmorphism).
- **Backend:** Express (Node.js) + SQLite (`better-sqlite3`, síncrono e ultra-rápido em arquivo local).
- **Autenticação:** JWT com controle de acesso baseado em papéis (RBAC) para **Professor** e **Aluno**.

---

## Principais Funcionalidades

1. **Modo Compartilhado (4 em 1):** Um único celular conecta simultaneamente de 2 a 4 alunos.
2. **Sincronização Justa de Pontos:** Ao acertar um quiz no aparelho compartilhado, os pontos são distribuídos igualmente para os 4 alunos da equipe e creditados na Meta Coletiva da Turma.
3. **Rodízio de Posse de Aparelho:** Alternância sugerida pelo aplicativo para evitar a monopolização do dispositivo.
4. **Múltiplas Inteligências:** Alunos escolhem perfis sem exposição forçada (**Curadores**, **Revisores**, **Comunicadores**).
5. **Resolução Híbrida:** Envio de fotos de cadernos manuscritos e mapas mentais feitos no papel.
6. **Impacto Silencioso (Gratidão Privada):** Eliminação de likes e métricas de vaidade em favor de notificações privadas de utilidade coletiva.
7. **Assistente Docente BNCC Oficial:** Geração e publicação de quizzes sem risco de alucinação, ancorados na API `bncc.dev` (MEC).
8. **Heatmap Pedagógico:** Learning Analytics por competência da BNCC sem monitoramento invasivo de telas.
9. **Moderação em Camadas:** Filtro de segurança de IA somado à validação por Líderes de Turma e docentes.
10. **Modo Foco & Pomodoro:** Timer de 25 minutos integrado para estudos sem distração.
11. **Privacy by Design & LGPD:** Proteção de dados de menores, ambiente escolar fechado e zero publicidade.

---

## Pré-requisitos

- **Node.js:** Versão 18, 20 ou 22 instalada (`node -v`)
- **npm:** Versão 9+ instalada (`npm -v`)

---

## Instalação

Clone o repositório e instale as dependências do servidor e do cliente:

```bash
# 1. Instalar dependências do Backend
cd server
npm install

# 2. Instalar dependências do Frontend
cd ../client
npm install

# 3. Voltar para a raiz do projeto
cd ..
```

---

## Como Rodar Localmente

### Opção A: Modo Desenvolvimento (Recomendado com Hot-Reload)

Abra dois terminais na raiz do projeto:

**Terminal 1 — Backend Express (Porta 3001):**
```bash
npm run server
```

**Terminal 2 — Frontend React/Vite (Porta 5173):**
```bash
npm run client
```

Acesse no navegador:
👉 **`http://localhost:5173`**

*(O Vite já está configurado com proxy reverso automático para o backend na porta 3001).*

---

### Opção B: Modo Produção Unificado (Porta Única 3001)

Compila o frontend e sobe toda a aplicação servida diretamente pelo Express:

```bash
# 1. Compilar o frontend React
npm run build:client

# 2. Iniciar o servidor em produção
npm start
```

Acesse no navegador:
👉 **`http://localhost:3001`**

---

## Como Rodar no ngrok (Acesso pelo Celular)

Com o servidor local em execução, abra um novo terminal e execute:

```bash
# Se estiver rodando o frontend em desenvolvimento (porta 5173):
ngrok http 5173

# Ou se estiver rodando o modo unificado (porta 3001):
ngrok http 3001
```

Copie a URL pública gerada (ex: `https://xxxx.ngrok-free.app` ou `.ngrok-free.dev`) e abra diretamente no navegador do seu smartphone.

---

## Testes Automatizados

Para executar os testes de integração do backend (autenticação JWT, integridade do SQLite, sincronização justa de pontos, RBAC e BNCC):

```bash
npm test
```

---

## Credenciais Pré-Cadastradas (Mocks Iniciais)

O banco SQLite é inicializado automaticamente com dados de demonstração:

| Papel | E-mail | Senha | Detalhes |
|---|---|---|---|
| **Professora** | `professora@kodic.edu` | `senha123` | Profª. Cláudia Mendes (Geografia & História) |
| **Aluno (Líder / Curador)** | `alex@kodic.edu` | `senha123` | Alex Silva (Dono do aparelho 4-em-1) |
| **Aluna (Revisor)** | `bia@kodic.edu` | `senha123` | Bia Santos |
| **Aluna (Comunicador)** | `carla@kodic.edu` | `senha123` | Carla Dias |
| **Aluno (Curador)** | `diego@kodic.edu` | `senha123` | Diego Alves |

> 💡 **Dica:** Na tela de autenticação, você também pode clicar nos botões de **"Acesso Rápido de Demonstração (1 Clique)"** para alternar instantaneamente entre a Professora e o Aluno sem precisar digitar senhas.

---

## Estrutura do Projeto

```
kodicedu/
├── package.json              # Scripts orquestradores da raiz
├── README.md                 # Guia de execução e arquitetura
├── server/                   # Backend Express + SQLite + JWT
│   ├── data/
│   │   └── kodicedu.db       # Banco de dados relacional local
│   ├── src/
│   │   ├── config/database.js
│   │   ├── middleware/auth.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── class.routes.js
│   │   │   ├── content.routes.js
│   │   │   ├── group.routes.js
│   │   │   └── quiz.routes.js
│   │   ├── seed/seedData.js  # Mocks iniciais completos
│   │   ├── services/
│   │   │   ├── bnccService.js
│   │   │   └── moderationService.js
│   │   └── index.js
│   └── test/
│       ├── api.test.js
│       └── e2e.test.js
└── client/                   # Frontend React 18 + Vite
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ThemeContext.jsx
        ├── services/api.js
        └── components/
            ├── auth/AuthModal.jsx
            ├── common/
            │   ├── Drawer.jsx
            │   └── Header.jsx
            ├── student/
            │   ├── StudentFocusModal.jsx
            │   ├── StudentGroupTab.jsx
            │   ├── StudentHomeTab.jsx
            │   ├── StudentImpactTab.jsx
            │   └── StudentMissionsTab.jsx
            └── teacher/
                └── TeacherDashboard.jsx
```
