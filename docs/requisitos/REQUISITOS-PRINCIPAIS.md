# Requisitos Principais — O que TEM que funcionar de verdade

**Atualizado em:** 2026-09-12

Este documento é um recorte do [`REQUISITOS.md`](./REQUISITOS.md): só o que **não pode ser mock, não pode falhar e não pode ser cortado**, porque é literalmente o que prova o conceito do Kodic Edu pros avaliadores. Tudo que não está aqui (Quadro de Avisos, Trilhas, Heatmap, Moderação, Impacto, Onboarding do docente...) pode virar mock, decorativo ou até sumir se o tempo apertar — **isto aqui não**.

A lógica: o pitch do Kodic Edu se sustenta em duas pernas. Se qualquer uma delas não funcionar ao vivo, a demo não convence.

---

## 1. Modo Compartilhado — o coração do pitch

É o diferencial único do produto: prova que "o celular como ferramenta de engajamento coletivo" resolve desigualdade de acesso, não amplia. Sem isso funcionando de verdade, o Kodic Edu vira "só mais um app de quiz".

| Requisito | Por que é inegociável |
|---|---|
| **RF-11** — Um dispositivo representa um grupo de 2 a 4 alunos. | É a premissa central do produto. Sem grupo de verdade, não existe "modo compartilhado" pra mostrar. |
| **RF-12** — Pontuação distribuída **igualmente** para TODOS os membros do grupo, não só um total do grupo. | É a prova concreta de "ninguém fica de fora por não ter celular" — o argumento social mais forte do projeto. Se só existir "pontuação do grupo" sem refletir no perfil de cada aluno, o pitch de inclusão fica só discurso. |
| **RF-14** — Ao acertar uma questão, o ponto é somado a **todos** os membros simultaneamente. | É o mecanismo que sustenta o RF-12. |
| **RF-13** — Botão "Girar Posse" alterna visualmente quem está "segurando" o celular (Rodízio Atual). | Mesmo sendo só UI (não trava input de ninguém), é a **prova visual em tela** de que o app existe pra ser passado de mão em mão. Cortar isso tira o único elemento que mostra a mecânica do modo compartilhado acontecendo — precisa estar clicável e visível na demo. |
| **Sincronização em tempo real entre dispositivos físicos diferentes** (Supabase Realtime/Firebase). | É o truque de demonstração combinado no `PLANO.md`: abrir em 2 celulares, um grupo acerta, o outro aparelho atualiza sozinho. Sem isso ao vivo, não tem como provar "colaboração real" — vira só uma tela bonita parada. |

## 2. Geração de Quiz por IA (o "uau" pro professor)

A segunda perna do pitch: provar que a ferramenta é **zero sobrecarga** pro professor.

| Requisito | Por que é inegociável |
|---|---|
| **RF-03 a RF-07** — Professor seleciona habilidade BNCC → sistema manda pra IA → IA retorna quiz → preview → publica. | É o fluxo que mostra "o professor não perde tempo criando conteúdo". Se travar ou não gerar nada em tempo real na demo, a segunda metade do pitch desmorona. |
| **Fallback de emergência** — ter 1 quiz pré-gerado guardado caso a API de IA falhe ou demore na hora da apresentação. | Risco real de demo ao vivo depender de API externa. Não é um requisito "bonito", é seguro contra desastre. |

## 3. Barra de Conquista da Turma em Tempo Real

| Requisito | Por que é inegociável |
|---|---|
| **RF-17** — Barra "Meta Coletiva da Turma" atualiza em até ~2s entre TODOS os dispositivos conectados. | É a cena-chave da apresentação: "quando um acerta, a barra sobe no aparelho do outro". Prova o conceito de coletividade de forma visual e instantânea — se demorar ou não sincronizar, a plateia não percebe a mágica. |

## 4. Resposta ao Quiz com Feedback Imediato

| Requisito | Por que é inegociável |
|---|---|
| **RF-15 / RF-16** — Aluno responde à pergunta e recebe feedback certo/errado na hora, antes de seguir. | Sem isso o loop de jogo não fecha — é o gatilho que dispara RF-12/RF-14/RF-17. |

---

## Checklist do dia da demo (não pode falhar)

- [ ] Dois dispositivos (celular + celular, ou celular + notebook) logados em grupos diferentes da mesma turma, ao vivo.
- [ ] Professor gera e publica um quiz novo em menos de ~10 segundos.
- [ ] Aluno responde no grupo, e a pontuação individual de **cada membro** do grupo aumenta — mostrar isso na tela, não só falar.
- [ ] Barra de Meta Coletiva sobe nos dois aparelhos quase ao mesmo tempo.
- [ ] Botão "Girar Posse" é clicado e o "Segurando" muda de pessoa na tela.
- [ ] Testar a geração de quiz por IA pelo menos uma vez com a internet/API real antes de subir no palco, e ter o quiz de fallback pronto.

## O que pode ficar mock/decorativo sem comprometer o pitch

Quadro de Avisos, Recompensa Coletiva, Trilhas/Missões, Impacto Silencioso, Heatmap do professor, Fila de Moderação, Onboarding progressivo do docente, Modo Foco/Pomodoro, badges extras, nota de LGPD. Todos já estão marcados como 🟡 MOCK no [`REQUISITOS.md`](./REQUISITOS.md) — são importantes pra riqueza visual e pra história completa, mas nenhum deles sozinho derruba o pitch se sair errado ou for cortado sob pressão de tempo.
