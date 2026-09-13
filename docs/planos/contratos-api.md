# Contratos de API REST (MVP Mockado)

> **Convenção:** JSON over HTTP  
> **URL Base:** `http://localhost:3001/api`  
> **Objetivo:** Estabelecer o contrato entre o Backend (Pessoa 1) e os Desenvolvedores Frontend (Pessoas 2, 3 e 4) na Milestone 0 para desenvolvimento sem bloqueios.

---

## 1. Autenticação Simulada & Utilidades de Desenvolvimento

### `GET /api/auth/personas`
Retorna a lista de usuários pré-configurados para o *Persona Switcher*.
- **Resposta `200 OK`:**
```json
[
  {
    "id": "usr_1",
    "nome": "Lucas Silveira",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Lucas",
    "papel": "Curador",
    "tipo": "aluno",
    "isLider": false,
    "turmaId": "turma_1a",
    "xp": 340,
    "nivel": 4
  },
  {
    "id": "usr_2",
    "nome": "Beatriz Mendes",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Beatriz",
    "papel": "Comunicadora",
    "tipo": "aluno",
    "isLider": false,
    "turmaId": "turma_1a",
    "xp": 280,
    "nivel": 3
  },
  {
    "id": "usr_3",
    "nome": "Gabriel Souza",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Gabriel",
    "papel": "Revisor",
    "tipo": "aluno",
    "isLider": true,
    "turmaId": "turma_1a",
    "xp": 520,
    "nivel": 6
  },
  {
    "id": "usr_docente",
    "nome": "Prof. Carlos Duarte",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Carlos",
    "tipo": "professor",
    "materias": ["História", "Sociologia"]
  }
]
```

### `POST /api/dev/reset`
Restaura os dados em memória para o estado inicial de fábrica (ideal para reiniciar a demo nos pitches).
- **Resposta `200 OK`:**
```json
{ "success": true, "message": "Dados restaurados para o seed inicial." }
```

---

## 2. Turmas & Progresso Coletivo (Barra da Turma)

### `GET /api/turmas/:id`
Retorna os dados da turma, matérias vinculadas e o progresso da Barra de Conquista.
- **Resposta `200 OK`:**
```json
{
  "id": "turma_1a",
  "nome": "1º Ano A - Ensino Médio",
  "periodo": "Matutino",
  "conquistaColetiva": {
    "metaAtual": 5000,
    "pontosAcumulados": 3750,
    "porcentagem": 75,
    "recompensaMeta": "Dia de Atividade Prática Interativa no Laboratório"
  },
  "materias": [
    { "id": "mat_hist", "nome": "História", "icone": "🏛️", "professor": "Prof. Carlos Duarte" },
    { "id": "mat_mat", "nome": "Matemática", "icone": "📐", "professor": "Profª. Helena Ramos" }
  ]
}
```

---

## 3. Modo Compartilhado & Quizzes

### `POST /api/sessions/shared`
Inicia uma sessão de quiz conectando de 2 a 4 alunos em um único dispositivo.
- **Requisição:**
```json
{
  "turmaId": "turma_1a",
  "materiaId": "mat_hist",
  "alunoIds": ["usr_1", "usr_2"]
}
```
- **Resposta `201 Created`:**
```json
{
  "sessionId": "sess_98234",
  "turmaId": "turma_1a",
  "alunosConectados": [
    { "id": "usr_1", "nome": "Lucas Silveira", "papel": "Curador" },
    { "id": "usr_2", "nome": "Beatriz Mendes", "papel": "Comunicadora" }
  ],
  "iniciadoEm": "2026-09-12T16:30:00Z"
}
```

### `GET /api/quizzes?materiaId=mat_hist`
Retorna a lista de quizzes disponíveis para a disciplina.
- **Resposta `200 OK`:**
```json
[
  {
    "id": "quiz_segunda_guerra",
    "titulo": "Segunda Guerra Mundial: Causas e Impactos",
    "materiaId": "mat_hist",
    "bnccCodigo": "EM13CHS102",
    "autor": "Prof. Carlos Duarte",
    "pontosRecompensa": 150,
    "tempoEstimadoMin": 5,
    "perguntasTotal": 3
  }
]
```

### `GET /api/quizzes/:id`
Retorna as perguntas detalhadas do quiz.
- **Resposta `200 OK`:**
```json
{
  "id": "quiz_segunda_guerra",
  "titulo": "Segunda Guerra Mundial: Causas e Impactos",
  "perguntas": [
    {
      "id": "q1",
      "enunciado": "Qual evento é considerado o estopim direto para o início da Segunda Guerra Mundial na Europa?",
      "opcoes": [
        { "id": "a", "texto": "A invasão da Polônia em 1939" },
        { "id": "b", "texto": "O bombardeio de Pearl Harbor em 1941" },
        { "id": "c", "texto": "A Queda da Bastilha" },
        { "id": "d", "texto": "A assinatura do Tratado de Versalhes" }
      ],
      "respostaCorreta": "a"
    }
  ]
}
```

### `POST /api/quizzes/:id/submit`
Submete as respostas da sessão compartilhada, distribui pontos igualmente para todos os membros e atualiza a Barra da Turma.
- **Requisição:**
```json
{
  "sessionId": "sess_98234",
  "turmaId": "turma_1a",
  "respostas": [
    { "perguntaId": "q1", "opcaoEscolhida": "a" }
  ]
}
```
- **Resposta `200 OK`:**
```json
{
  "sucesso": true,
  "acertos": 1,
  "total": 1,
  "xpGanhoPorAluno": 150,
  "alunosBeneficiados": ["usr_1", "usr_2"],
  "conquistaTurmaAtualizada": {
    "pontosAcumulados": 3900,
    "porcentagem": 78
  }
}
```

---

## 4. Hub de Conhecimento (Acervo do Curador)

### `GET /api/materiais?materiaId=mat_hist`
Retorna os materiais de apoio e resumos aprovados na disciplina.
- **Resposta `200 OK`:**
```json
[
  {
    "id": "mat_resumo_1",
    "titulo": "Mapa Mental: Linha do Tempo da Segunda Guerra",
    "tipo": "link",
    "url": "https://exemplo.org/mapa-segunda-guerra.pdf",
    "descricao": "Resumo visual com as principais fases do conflito e alianças.",
    "materiaId": "mat_hist",
    "autorId": "usr_1",
    "autorNome": "Lucas Silveira (Curador)",
    "status": "aprovado",
    "impactoUtilidadeTotal": 4
  }
]
```

### `POST /api/materiais`
Submete um novo material de estudo (entra na Fila de Moderação).
- **Requisição:**
```json
{
  "titulo": "Resumo de Revisão - Fascismo e Nazismo",
  "tipo": "texto",
  "conteudo": "Principais características dos regimes totalitários...",
  "materiaId": "mat_hist",
  "turmaId": "turma_1a",
  "autorId": "usr_1"
}
```
- **Resposta `201 Created`:**
```json
{
  "id": "mat_resumo_2",
  "status": "pendente_moderacao",
  "mensagem": "Material enviado para moderação com sucesso!"
}
```

---

## 5. Gratidão Privada (Impacto Silencioso)

### `POST /api/gratidao/enviar`
Um aluno registra que o material de outro colega o ajudou nos estudos (sem contadores públicos de likes).
- **Requisição:**
```json
{
  "materialId": "mat_resumo_1",
  "autorMaterialId": "usr_1",
  "alunoAgradecendoId": "usr_2"
}
```
- **Resposta `200 OK`:**
```json
{
  "sucesso": true,
  "mensagem": "Agradecimento silencioso enviado ao autor!"
}
```

### `GET /api/alunos/:id/notificacoes`
Retorna as mensagens privadas de impacto do aluno autenticado.
- **Resposta `200 OK`:**
```json
[
  {
    "id": "notif_1",
    "tipo": "gratidao_privada",
    "mensagem": "Seu material 'Mapa Mental: Linha do Tempo' ajudou um colega a revisar para a atividade de hoje!",
    "timestamp": "2026-09-12T15:40:00Z",
    "lida": false
  }
]
```

---

## 6. Fila de Moderação Descentralizada

### `GET /api/moderacao/pendentes?turmaId=turma_1a`
Lista itens pendentes de aprovação na turma (visível para *Líderes de Turma* e *Professores*).
- **Resposta `200 OK`:**
```json
[
  {
    "id": "mod_item_44",
    "tipo": "material_estudo",
    "origemId": "mat_resumo_2",
    "titulo": "Resumo de Revisão - Fascismo e Nazismo",
    "autorNome": "Lucas Silveira",
    "turmaId": "turma_1a",
    "materiaNome": "História",
    "conteudo": "Principais características dos regimes totalitários...",
    "submetidoEm": "2026-09-12T16:10:00Z"
  }
]
```

### `POST /api/moderacao/:id/decidir`
Aprova ou reprova o conteúdo.
- **Requisição:**
```json
{
  "decisao": "aprovado",
  "moderadorId": "usr_3",
  "moderadorNome": "Gabriel Souza (Líder de Turma)",
  "justificativa": "Conteúdo alinhado ao conteúdo da aula e de alta qualidade."
}
```
- **Resposta `200 OK`:**
```json
{
  "sucesso": true,
  "statusFinal": "aprovado",
  "mensagem": "Item aprovado e publicado no acervo da turma."
}
```

---

## 7. Analytics Pedagógico (Painel do Professor)

### `GET /api/turmas/:id/analytics-bncc`
Retorna o mapa de calor de domínio das habilidades da BNCC pela turma.
- **Resposta `200 OK`:**
```json
{
  "turmaId": "turma_1a",
  "habilidades": [
    {
      "codigoBNCC": "EM13CHS102",
      "descricao": "Identificar e analisar a crise do entreguerras e ascensão dos totalitarismos.",
      "taxaDominio": 84,
      "status": "dominado",
      "nivel": "verde"
    },
    {
      "codigoBNCC": "EM13CHS204",
      "descricao": "Análise geopolítica dos blocos pós-guerra.",
      "taxaDominio": 48,
      "status": "atencao_necessaria",
      "nivel": "amarelo"
    }
  ]
}
```
