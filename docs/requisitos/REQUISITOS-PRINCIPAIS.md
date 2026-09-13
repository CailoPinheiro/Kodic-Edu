# Requisitos Principais: O que Tem que Funcionar de Verdade

**Atualizado em:** 2026-09-13

Este documento é um recorte do [`REQUISITOS.md`](./REQUISITOS.md): só o que não pode ser mock, não pode falhar e não pode ser cortado, porque é o que prova o conceito do Kodic Edu para os avaliadores. Tudo que não está aqui (Quadro de Avisos, Trilhas, Heatmap, Moderação, Impacto, Onboarding do docente) pode virar mock, decorativo ou até sumir se o tempo apertar. Isto aqui não.

O pitch do Kodic Edu se sustenta em duas pernas. Se qualquer uma delas não funcionar ao vivo, a demo não convence.

## 1. Modo Compartilhado: o coração do pitch

É o diferencial único do produto: prova que "o celular como ferramenta de engajamento coletivo" resolve desigualdade de acesso, em vez de ampliá-la. Sem isso funcionando de verdade, o Kodic Edu vira "só mais um app de quiz".

| ID | Requisito | Por que é inegociável | Status |
|----|-----------|------------------------|--------|
| RF-11 | Um dispositivo representa um grupo de 2 a 4 alunos. | É a premissa central do produto. Sem grupo de verdade, não existe "modo compartilhado" para mostrar. | 🟢 REAL |
| RF-12 | Pontuação distribuída igualmente para todos os membros do grupo, não só um total do grupo. | É a prova concreta de que ninguém fica de fora por não ter celular, o argumento social mais forte do projeto. Se existisse só "pontuação do grupo" sem refletir no perfil de cada aluno, o pitch de inclusão ficaria só no discurso. | 🟢 REAL |
| RF-14 | Ao acertar uma questão, a pontuação base é distribuída simultaneamente a todos os membros do grupo, somada a um bônus para o detentor atual do aparelho. | É o mecanismo que sustenta o RF-12. | 🟢 REAL |
| RF-13 | Botão "Girar Posse" alterna visualmente quem está segurando o celular (Rodízio Atual). | Mesmo sendo apenas UI (não trava input de ninguém), é a prova visual em tela de que o app existe para ser passado de mão em mão. Precisa estar clicável e visível na demo. | 🟢 REAL |
| N/A | Sincronização em tempo real entre dispositivos físicos diferentes (Supabase Realtime/Firebase). | É o truque de demonstração: abrir em 2 celulares, um grupo acerta, o outro aparelho atualiza sozinho. Sem isso ao vivo, não há como provar "colaboração real". | 🟡 MOCK |

**Sobre a sincronização em tempo real:** não há Supabase/Firebase Realtime implementado. O que existe é polling HTTP a cada 4 segundos (`setInterval` em `src/app/page.tsx`). Funciona para a demo, já que a tela atualiza sozinha, mas não é a tecnologia planejada e não atinge a meta de ~2s.

## 2. Geração de Quiz por IA: o "uau" para o professor

A segunda perna do pitch: provar que a ferramenta é zero sobrecarga para o professor.

| ID | Requisito | Por que é inegociável | Status |
|----|-----------|------------------------|--------|
| RF-03 a RF-07 | Professor seleciona habilidade BNCC, sistema manda para a IA, IA retorna quiz, preview, publica. | É o fluxo que mostra que o professor não perde tempo criando conteúdo. Se travar ou não gerar nada em tempo real na demo, a segunda metade do pitch desmorona. | 🟡 MOCK |
| N/A | Fallback de emergência: ter 1 quiz pré-gerado guardado caso a API de IA falhe ou demore na hora da apresentação. | Risco real de demo ao vivo depender de API externa. Não é um requisito decorativo, é seguro contra desastre. | Não se aplica |

**Sobre a geração por IA:** `BnccService.generateQuiz` não chama nenhuma API de IA (Gemini/OpenAI); sorteia uma pergunta de um banco fixo pré-escrito por código BNCC. É uma decisão consciente de manter assim por ora, sem tempo para integrar IA real agora. O fluxo de UI (selecionar, gerar, preview, publicar) funciona de ponta a ponta; só o "cérebro" é local. Como consequência, o item de fallback deixa de ser um risco: sem API externa, não há o que falhar.

## 3. Barra de Conquista da Turma em Tempo Real

| ID | Requisito | Por que é inegociável | Status |
|----|-----------|------------------------|--------|
| RF-17 | Barra "Meta Coletiva da Turma" atualiza em até ~2s entre todos os dispositivos conectados. | É a cena-chave da apresentação: quando um grupo acerta, a barra sobe no aparelho do outro. Prova o conceito de coletividade de forma visual e instantânea. Se demorar ou não sincronizar, a plateia não percebe a mágica. | 🟡 MOCK (ver seção 1) |

## 4. Resposta ao Quiz com Feedback Imediato

| ID | Requisito | Por que é inegociável | Status |
|----|-----------|------------------------|--------|
| RF-15 / RF-16 | Aluno responde à pergunta e recebe feedback certo/errado na hora, antes de seguir. | Sem isso o loop de jogo não fecha, é o gatilho que dispara RF-12/RF-14/RF-17. | 🟢 REAL |

## Checklist do dia da demo

- [ ] Dois dispositivos (celular + celular, ou celular + notebook) logados em grupos diferentes da mesma turma, ao vivo.
- [ ] Professor gera e publica um quiz novo em menos de ~10 segundos.
- [ ] Aluno responde no grupo, e a pontuação individual de cada membro do grupo aumenta (mostrar isso na tela, não só falar).
- [ ] Barra de Meta Coletiva sobe nos dois aparelhos quase ao mesmo tempo.
- [ ] Botão "Girar Posse" é clicado e o "Segurando" muda de pessoa na tela.
- [x] ~~Testar a geração de quiz por IA com a internet/API real~~: não se aplica. A geração está mockada (banco fixo de perguntas), sem chamada de API externa.

## O que pode ficar mock/decorativo sem comprometer o pitch

Quadro de Avisos, Recompensa Coletiva, Trilhas/Missões, Impacto Silencioso, Heatmap do professor, Fila de Moderação, Onboarding progressivo do docente, Modo Foco/Pomodoro, badges extras, nota de LGPD. Todos já estão marcados como 🟡 MOCK no [`REQUISITOS.md`](./REQUISITOS.md). São importantes para a riqueza visual e para a história completa, mas nenhum deles sozinho derruba o pitch se sair errado ou for cortado sob pressão de tempo.
