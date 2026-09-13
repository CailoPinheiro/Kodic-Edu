# Plano de Execução & Divisão de Responsabilidades (Hackathon)

> **Projeto:** Kodic Edu — MVP para Hackathon  
> **Stack:** React (Mobile-First) + Node.js/Express + Stateful Mock In-Memory Store  
> **Equipe:** 4 Desenvolvedores  
> **Objetivo:** Protótipo funcional com validação completa das **interações entre alunos** e dinâmicas de sala de aula.

---

## 🎯 Arquitetura para Testabilidade: *Stateful Mock Store & Persona Switcher*

Para permitir que a banca de jurados teste o fluxo completo de interação entre múltiplos alunos em um único dispositivo ou navegador, a aplicação adota dois padrões arquiteturais centrais:

1. **Stateful In-Memory Store (Backend Node.js/Express):**
   - Embora não utilize banco de dados externo (Postgres/Mongo) para acelerar a entrega do hackathon, o backend mantém um estado vivo em memória (`in-memory store`) carregado com `seed data` realista.
   - Quando um aluno envia um resumo, outro aluno modera, o grupo responde ao quiz ou um colega envia um agradecimento, o estado em memória é alterado e persistido durante a sessão do servidor.
   - Endpoint `POST /api/dev/reset` para restaurar o estado inicial da demo com 1 clique.

2. **Persona Switcher (Frontend React):**
   - Uma barra de utilitário fixa no topo da interface permite ao testador/jurado alternar instantaneamente de papel e identidade:
     - 👤 **Lucas (Curador - Aluno):** Cria materiais de estudo e resumos.
     - 👤 **Beatriz (Comunicadora - Aluno):** Participa do Modo Compartilhado e quizzes.
     - 👤 **Gabriel (Líder de Turma / Revisor - Aluno):** Possui permissão de moderação da turma.
     - 👨🏫 **Prof. Carlos (Docente):** Painel analítico de calor, turmas e mural de avisos.

---

## 👥 Divisão de Papéis (4 Pessoas)

```
                       ┌────────────────────────────────────────┐
                       │        PESSOA 1: Backend & Core        │
                       │  Node.js/Express + Mock Data & Regras  │
                       └───────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼────────────────────────────────┐
         ▼                                 ▼                                ▼
┌─────────────────┐             ┌─────────────────────┐          ┌──────────────────────┐
│    PESSOA 2     │             │      PESSOA 3       │          │       PESSOA 4       │
│ Modo Compartilhado│           │   Perfil, Acervo &  │          │ Painel do Professor  │
│   & Gamificação │             │   Gratidão Privada  │          │     & Moderação      │
└─────────────────┘             └─────────────────────┘          └──────────────────────┘
```

| Integrante | Papel / Escopo Principal | Foco Tecnológico |
|---|---|---|
| **Pessoa 1** | **Backend Lead, Estado em Memória & Regras de Domínio** | Node.js, Express, Schemas JSON, Lógica de Pontuação Coletiva e Seed Data. |
| **Pessoa 2** | **Frontend — Modo Compartilhado, Quizzes & Gamificação** | React, Gestão de Sessão Multi-usuário, Resolução de Quizzes, Resolução Híbrida e Modo Foco. |
| **Pessoa 3** | **Frontend — Identidade, Acervo do Curador & Gratidão Privada** | React, Perfil do Aluno, Tríade de Papéis, Badges, Feed de Conhecimento e Notificações Silenciosas. |
| **Pessoa 4** | **Frontend — Gestão Docente, Moderação & Analytics** | React, Painel do Professor, Fila de Moderação do Líder de Turma, Mapa de Calor da BNCC e Persona Switcher. |

---

## 🏁 Cronograma em 4 Milestones Sequenciais

### 📍 Milestone 0: Fundação, Design System Base & Contrato de API (0h - 4h)
> **Meta:** Desbloquear todo o time no minuto zero. Contratos de API definidos, componentes base prontos e persona switcher configurado.

- **Pessoa 1 (Backend):**
  - Setup do projeto Node.js/Express com CORS e JSON parser.
  - Criação da estrutura de dados em memória (`src/data/store.js`) com dados mockados de turmas, alunos, matérias, quizzes e notificações.
  - Implementação das rotas de leitura estáticas e documentação em `docs/planos/contratos-api.md`.
- **Pessoa 2 (Frontend Core):**
  - Setup do projeto React (Vite) + Tailwind CSS + React Router.
  - Configuração da estrutura de pastas (`/components`, `/pages`, `/services`, `/context`).
  - Shell base da aplicação Mobile-First (Navbar superior e Bottom Navigation).
- **Pessoa 3 (Frontend Social/UI):**
  - Criação do Design System de componentes compartilhados: `Button`, `Card`, `Badge`, `Avatar`, `Modal`, `Toast`.
  - Estilização dos temas da Tríade de Papéis (Azul para Curador, Laranja para Comunicador, Roxo para Revisor).
- **Pessoa 4 (Frontend Docente/Switcher):**
  - Implementação do **Persona Switcher** global conectado ao `AuthContext` (permitindo trocar o usuário ativo na aplicação).
  - Shell base do Painel do Professor (layout responsivo com sidebar e header institucional).

---

### 📍 Milestone 1: O "Core Loop" em Sala de Aula (4h - 12h)
> **Meta:** O ciclo fundamental de aula funcionando: login compartilhado de 2 a 4 alunos, resolução de quiz, pontuação igualitária e Barra da Turma.
> **🎯 Demo Parcial 1:** Selecionar Lucas e Beatriz no mesmo aparelho, responder um quiz de História e ver a Barra da Sala avançar junto com o XP dos dois.

- **Pessoa 1 (Backend):**
  - Endpoint `POST /api/sessions/shared`: cria sessão ativa com 2 a 4 alunos.
  - Endpoint `POST /api/quizzes/:id/submit`: processa respostas, credita pontos iguais para todos os membros da sessão e incrementa o progresso coletivo da turma.
  - Endpoint `GET /api/turmas/:id/progresso`: retorna a porcentagem da Barra de Conquista da Turma.
- **Pessoa 2 (Frontend):**
  - Tela do **Modo Compartilhado**: seleção visual dos avatares/nomes dos colegas de mesa para iniciar a sessão em grupo.
  - Tela de **Execução do Quiz**: perguntas de múltipla escolha com cronômetro, transição suave de questões e feedback visual de acerto coletivo.
- **Pessoa 3 (Frontend):**
  - Tela de **Perfil do Aluno**: exibição do avatar, papel predominante, barra de nível e galeria de *Badges* conquistadas.
  - Atualização reativa do perfil após resolução de quizzes em grupo.
- **Pessoa 4 (Frontend):**
  - Componente animado da **Barra de Conquista da Turma** (meta coletiva que avança com efeito visual de comemoração).
  - Tela do **Modo Foco / Pomodoro**: temporizador de estudo com visualização imersiva e bloqueio de notificações internas.

---

### 📍 Milestone 2: Interações P2P, Curadoria & Moderação (12h - 20h)
> **Meta:** As mecânicas inovadoras do Kodic Edu funcionando: envio de materiais, moderação colaborativa por aluno líder e notificações de gratidão privada.
> **🎯 Demo Parcial 2:** Curador posta resumo -> Líder de Turma aprova na moderação -> Colegas usam o resumo -> Curador recebe notificação de gratidão silenciosa.

- **Pessoa 1 (Backend):**
  - Endpoint `POST /api/materiais`: submissão de materiais/resumos para a turma.
  - Endpoints de **Moderação**: `GET /api/moderacao/pendentes` e `POST /api/moderacao/:id/decidir` (aprovar/rejeitar com registro de quem moderou).
  - Endpoints de **Gratidão Privada**: `POST /api/gratidao/enviar` e `GET /api/alunos/:id/notificacoes`.
- **Pessoa 2 (Frontend):**
  - **Resolução Híbrida:** Desafio prático com simulação de upload/anexo de foto do caderno e pré-visualização da imagem manuscrita.
- **Pessoa 3 (Frontend):**
  - **Hub de Conhecimento (Acervo):** Feed de materiais por matéria com botão interativo *"Esse material me ajudou!"*.
  - **Central de Gratidão Privada:** Tela de notificações exibindo apenas o impacto silencioso (sem métricas públicas de vaidade/likes).
- **Pessoa 4 (Frontend):**
  - **Fila de Moderação Descentralizada:** Interface do *Líder de Turma* e do *Professor* para aprovar/reprovar conteúdos pendentes com feedback.
  - **Mapa de Aprendizagem (Heatmap):** Visão pedagógica com cores indicando o domínio da turma sobre tópicos da BNCC.

---

### 📍 Milestone 3: Integração End-to-End, Seed Scenarios & Pitch (20h - 24h)
> **Meta:** Aplicação 100% conectada ao Express, dados realistas para os jurados, fluxo de teste guiado e apresentação afinada.
> **🎯 Demo Final:** Apresentação impecável de 3 minutos cobrindo todo o ciclo de valor.

- **Pessoa 1 (Backend):**
  - Carga de `seed data` completa com matérias reais (História, Matemática, Ciências), quizzes contextualizados e histórico de notificações.
  - Verificação de robustez e tratamento de erros dos endpoints.
- **Pessoa 2, 3 e 4 (Frontend):**
  - Integração final das chamadas de API (serviços Axios/Fetch).
  - Inclusão do botão *"Resetar Cenário da Demo"* e modal de *"Guia da Demonstração"* com instruções passo a passo para os jurados.
  - Testes de usabilidade em telas mobile reais e gravação do vídeo de backup para o pitch.

---

## 🔄 Matriz de Dependências & Gestão de Riscos

| Risco Identificado | Impacto no Hackathon | Estratégia de Mitigação |
|---|---|---|
| **Atraso no backend bloqueando o frontend** | Alto | **API Contract-First:** Contratos definidos na Milestone 0 permitem que o front use mocks locais caso o backend atrase. |
| **Dificuldade de testar múltiplos alunos no mesmo PC** | Alto | **Persona Switcher:** Barra de alternância rápida de perfis em 1 clique resolve o problema de testes. |
| **Perda de tempo com banco de dados/migrations** | Médio | **Stateful In-Memory Store:** Sem banco de dados externo; dados ficam em memória no Node.js com reset fácil. |
| **Inconsistência visual entre as telas** | Médio | **Design System unificado na Milestone 0:** Pessoa 3 entrega componentes reutilizáveis para todos usarem. |
