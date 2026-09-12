# Diretrizes para Agentes (AGENTS.md)

## 📌 Estado Atual do Repositório
- Repositório em fase de inicialização e especificação de requisitos.
- **Especificações de Produto:**
  - `docs/plano de ação.md`: Documento conceitual completo do Kodic Edu (gamificação cooperativa escolar, modo compartilhado, papéis, moderação descentralizada e BNCC).
  - `docs/limitacoes.md`: Mapeamento de limitações técnicas, regulatórias (LGPD) e delimitação de escopo (MVP vs. Produção).
  - `docs/planos/`: Pasta contendo a divisão de responsabilidades em Milestones para 4 devs, contratos de rotas REST e roteiro de demonstração interativa.
  - `README.md`: Visão geral da proposta, arquitetura de domínio e roadmap.

## 💻 Stack Tecnológica (MVP)
- **Frontend:** React (SPA, foco Mobile-First / responsivo).
- **Backend:** Node.js + Express (API REST).
- **Dados:** Mockados em arquivos JSON / estrutura em memória (sem dependência de banco de dados externo no MVP).

## 🧠 Regras de Negócio e Convenções Críticas
- **Gamificação Cooperativa:** Nunca implementar rankings competitivos individuais (*leaderboards*). O progresso do app sempre alimenta a **Barra de Conquista da Turma** (meta coletiva).
- **Gratidão Privada:** Sem contadores públicos de curtidas (*likes*). O feedback entre alunos opera via notificações individuais e diretas de utilidade ("Impacto Silencioso").
- **Modo Compartilhado:** Um dispositivo atende de 2 a 4 alunos; as ações e pontos do grupo refletem igualmente no perfil individual de cada integrante.
- **Tríade de Papéis:** Alunos atuam como *Comunicadores*, *Curadores* ou *Revisores*.
- **Idioma do Repositório:** A documentação e termos de domínio estão em **Português (pt-BR)**.
