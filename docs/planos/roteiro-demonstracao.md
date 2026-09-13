# Roteiro de Demonstração & Testes Interativos

> **Objetivo:** Guia passo a passo para testar e validar 100% das **interações entre alunos**, dinâmicas de sala de aula e painel docente no MVP do Kodic Edu.

---

## ⏱️ Cenário de Demonstração Completo (Duração: ~3 minutos)

Este fluxo demonstra a proposta de valor completa do Kodic Edu sem quebras, utilizando o **Persona Switcher** no topo da tela.

---

### 🎬 Passo 1: Preparação do Cenário
1. Abra a aplicação no navegador em modo de emulação mobile ou desktop.
2. Na barra do **Persona Switcher** no topo, clique no botão **"🔄 Resetar Demo"** para garantir que a base em memória comece no estado de fábrica.

---

### 🎬 Passo 2: O Curador compartilha conhecimento
1. No **Persona Switcher**, selecione **👤 Lucas (Curador)**.
2. Observe o perfil de Lucas: papel de *Curador*, medalha *"Pesquisador Destaque"*.
3. Navegue até a matéria **História** -> **Hub de Conhecimento**.
4. Clique em **"Novo Material de Estudo"**.
5. Preencha:
   - **Título:** *"Resumo Rápido: Linha do Tempo da Segunda Guerra"*
   - **Tipo:** Link/Texto
   - **Conteúdo:** *"Resumo esquemático dos principais acontecimentos de 1939 a 1945."*
6. Clique em **"Enviar para a Turma"**.
7. Observe a mensagem de feedback: *"Material enviado para a Fila de Moderação da Turma."*

---

### 🎬 Passo 3: Moderação Descentralizada por Aluno Líder
1. No **Persona Switcher**, mude para **👤 Gabriel (Líder de Turma / Revisor)**.
2. Note o badge especial de *"Líder de Turma"* no cabeçalho.
3. Acesse a aba **"Fila de Moderação"**.
4. Veja o material recém-enviado por Lucas na lista de itens pendentes.
5. Clique em **"Aprovar Material"** e confirme.
6. O material agora está oficialmente publicado e visível para toda a turma de História!

---

### 🎬 Passo 4: O "Modo Compartilhado" em Sala de Aula
1. No **Persona Switcher**, selecione **👤 Beatriz (Comunicadora)**.
2. Acesse a matéria **História** e clique em **"Iniciar Atividade em Grupo"**.
3. Na tela de **Modo Compartilhado**, o app pergunta: *"Quem está usando este aparelho com você?"*.
4. Selecione **Lucas** para compor a mesa (Grupo: Beatriz + Lucas).
5. Clique em **"Iniciar Quiz Cooperativo"**.
6. Responda às perguntas do Quiz sobre Segunda Guerra Mundial:
   - Pergunta 1: Selecione a resposta correta (Invasão da Polônia em 1939).
7. Finalize o quiz e veja a tela de vitória:
   - *"Parabéns, Grupo! +150 XP creditados para Beatriz e +150 XP para Lucas."*
   - *"A Barra da Turma avançou para 78%!"*

---

### 🎬 Passo 5: Gratidão Privada (Impacto Silencioso)
1. Ainda como **Beatriz**, abra a aba do **Hub de Conhecimento** em História.
2. Veja o resumo que Lucas publicou.
3. Clique no botão de coração/aperto de mão: **"Esse material me ajudou!"**.
4. No **Persona Switcher**, troque de volta para **👤 Lucas (Curador)**.
5. Clique no ícone do sino / **Central de Gratidão**.
6. Veja a nova notificação privada:
   > 💌 *"Seu material 'Resumo Rápido: Linha do Tempo' ajudou um colega a revisar para a atividade de hoje!"*
7. Destaque para os jurados: **Sem contadores públicos de curtidas, sem comparações tóxicas. Apenas impacto pedagógico real.**

---

### 🎬 Passo 6: A Visão do Professor (Zero Sobrecarga)
1. No **Persona Switcher**, mude para **👨🏫 Prof. Carlos (Docente)**.
2. Veja o **Dashboard da Turma 1º Ano A**:
   - **Barra de Conquista da Turma:** em 78% da meta.
   - **Mapa de Calor da BNCC:** Mostra que a habilidade `EM13CHS102` atingiu 84% de domínio verde após a atividade dos grupos.
   - Histórico de moderação delegada aos alunos líder com registro de auditoria.

---

## 🧪 Matriz de Validação das Regras de Negócio

| Regra / Diferencial | Onde é validado no roteiro | Resultado Esperado |
|---|---|---|
| **Sem Leaderboards Individuais** | Passo 4 e Perfil | Não existe tela de ranking competitivo; apenas Barra Coletiva da Turma. |
| **Pontuação Igualitária no Modo Compartilhado** | Passo 4 | Ambos os alunos selecionados na sessão ganham exatamente o mesmo XP. |
| **Gratidão Privada** | Passo 5 | A notificação de utilidade é visível apenas para o autor do material. |
| **Moderação Descentralizada** | Passo 3 | Aluno com cargo de Líder aprova itens sem sobrecarregar o professor. |
| **Alinhamento BNCC** | Passo 6 | Heatmap do professor atualiza com os códigos de competências oficiais. |
