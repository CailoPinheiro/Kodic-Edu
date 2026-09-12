# Kodic Edu 📚📱

> **O smartphone como ferramenta de engajamento coletivo e inclusão no ambiente escolar.**

O **Kodic Edu** é um ecossistema gamificado projetado para transformar o celular — frequentemente visto como foco de distração em sala de aula — em um catalisador de cooperação, foco e aprendizagem ativa. O projeto prioriza a inclusão socioeconômica, o bem-estar mental dos estudantes e a mitigação da sobrecarga docente.

---

## 🎯 Proposta e Diferenciais

O projeto apoia-se em princípios pedagógicos e técnicos desenhados para a realidade escolar brasileira:

- 🤝 **Inclusão com "Modo Compartilhado":** Permite que 1 único smartphone conecte de 2 a 4 alunos simultaneamente. As respostas e pontuações obtidas são sincronizadas e atribuídas equitativamente a todos os membros, transformando a ausência de aparelhos em estímulo ao trabalho em equipe.
- 🧠 **Design Centrado na Saúde Mental & Papéis:** Alunos contribuem conforme seus perfis socioemocionais (*Comunicadores*, *Curadores* e *Revisores*), valorizando múltiplas inteligências sem exposição pública obrigatória.
- 🤫 **Gratidão Privada (Fim das Métricas de Vaidade):** Substitui curtidas e rankings individuais competitivos por notificações silenciosas de utilidade real (ex: *"Seu resumo ajudou 3 colegas hoje"*).
- 🏆 **Barra de Conquista da Turma:** Gamificação estritamente cooperativa. O progresso de cada grupo alimenta uma meta única e coletiva da sala de aula.
- 📝 **Resolução Híbrida (Físico + Digital):** Resolução de desafios aceita envio de fotos de anotações e cálculos no caderno, integrando o raciocínio tradicional à facilidade digital.
- 🛡️ **Moderação Inteligente e Descentralizada:** Conteúdos passam por triagem automatizada inicial e validação por *Líderes de Turma* sob supervisão docente, garantindo segurança sem sobrecarregar o professor.
- 📖 **Alinhamento à BNCC:** Integração planejada com a taxonomia curricular e API da `bncc.dev` para mapeamento de habilidades e trilhas personalizadas.

---

## 🛠️ Stack Tecnológica (Escopo MVP)

Para validação rápida e demonstração dos fluxos centrais da aplicação, o MVP é estruturado em:

| Camada | Tecnologia | Função |
|---|---|---|
| **Frontend** | [React](https://react.dev/) | Interface do usuário responsiva (Mobile-First), modular e baseada em componentes. |
| **Backend** | [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) | API RESTful para fornecimento de rotas pedagógicas, moderação e grupos. |
| **Persistência** | **Dados Mockados (JSON / In-Memory)** | Simulação rápida dos estados de turmas, matérias, grupos, quizzes e conquistas sem complexidade de infraestrutura de banco de dados no MVP. |

---

## 🏛️ Arquitetura do Domínio

A hierarquia escolar no Kodic Edu é estruturada da seguinte forma:

```
Escola
└── Turma (ex: 1º Ano A)
    ├── Matéria (ex: História, Matemática)
    │   └── Grupos de Disciplina (2 a 4 alunos com papéis definidos)
    └── Grupos de Estudo Livres (ex: "Foco no ENEM", "Clube de Leitura")
```

---

## 📂 Estrutura de Documentação

- [`docs/plano de ação.md`](docs/plano%20de%20ação.md): Especificação completa do conceito pedagógico, personas, dinâmicas de sala e funcionalidades do Kodic Edu.
- [`docs/limitacoes.md`](docs/limitacoes.md): Análise detalhada das limitações técnicas, operacionais, regulatórias (LGPD) e delimitação de escopo entre MVP e Produção.
- **Planos de Implementação (Hackathon):**
  - [`docs/planos/divisao-responsabilidades-hackathon.md`](docs/planos/divisao-responsabilidades-hackathon.md): Divisão de papéis para 4 pessoas em 4 Milestones sequenciais e arquitetura de testes com *Persona Switcher*.
  - [`docs/planos/contratos-api.md`](docs/planos/contratos-api.md): Especificação dos contratos da API REST mockada para desenvolvimento desacoplado.
  - [`docs/planos/roteiro-demonstracao.md`](docs/planos/roteiro-demonstracao.md): Roteiro de testes interativos e fluxo guiado para avaliação das interações entre alunos.
- [`AGENTS.md`](AGENTS.md): Diretrizes de contexto e instruções para agentes de desenvolvimento de IA neste repositório.

---

## 🗺️ Roadmap de Desenvolvimento

- [x] **Fase 0: Concepção e Planejamento**
  - [x] Especificação de requisitos e dinâmicas pedagógicas (`docs/plano de ação.md`).
  - [x] Levantamento de limitações técnicas e fronteiras de escopo (`docs/limitacoes.md`).
  - [x] Definição de stack do MVP (React + Node.js/Express + Mock Data).
- [ ] **Fase 1: Backend MVP (Node.js/Express)**
  - [ ] Estruturação da API com endpoints REST mockados para Turmas, Grupos, Quizzes e Moderação.
- [ ] **Fase 2: Frontend MVP (React)**
  - [ ] Telas de autenticação simulada e seleção de papéis.
  - [ ] Fluxo do "Modo Compartilhado" e resolução de quizzes.
  - [ ] Painel do Professor (Mapa de calor e gestão de turmas) e Fila de Moderação.
  - [ ] Notificações de "Gratidão Privada" e Barra de Conquista Coletiva.
- [ ] **Fase 3: Refinamento & Próximas Fases**
  - [ ] Persistência em banco de dados real.
  - [ ] Integração com IA para moderação multimodal e API da BNCC.
