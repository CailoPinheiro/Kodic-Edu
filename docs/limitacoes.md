# Limitações e Delimitações do Projeto Kodic Edu

Este documento estabelece as fronteiras operacionais, técnicas, pedagógicas e regulatórias do **Kodic Edu**, estruturadas a partir da análise crítica do [Plano de Ação](plano%20de%20ação.md). O objetivo é orientar o desenvolvimento técnico, alinhar expectativas de produto e delimitar o escopo entre o **MVP** e versões futuras.

---

## 1. Limitações Técnicas e de Arquitetura

### 1.1. Restrições de Plataforma e Sistema Operacional (Modo Foco)
- **Bloqueio de Notificações em Aplicações Web:** O plano prevê um "Modo Foco" capaz de silenciar notificações externas de outros aplicativos (redes sociais, mensagens). Em plataformas Web (React SPA / PWA), navegadores não possuem privilégios de sistema para interceptar ou silenciar notificações de apps terceiros instalados no sistema operacional (Android/iOS).
  - *Delimitação Técnica:* No escopo Web/MVP, o "Modo Foco" deve limitar-se ao silenciamento de notificações internas da própria plataforma, tela cheia com bloqueio de alertas da aplicação e timer Pomodoro integrado. O controle nativo de interrupções exige app empacotado nativamente (ex: React Native com permissões de `NotificationListenerService` / `Do Not Disturb` API).

### 1.2. Conectividade e Infraestrutura Escolar
- **Dependência de Rede:** Muitas escolas enfrentam instabilidade severa ou ausência total de conexão com a internet. O "Modo Compartilhado" com sincronização imediata em nuvem pressupõe conectividade ativa.
  - *Delimitação Técnica:* O sistema precisará evoluir para uma arquitetura *Offline-First* com sincronização diferida e resolução de conflitos quando a rede for restabelecida.

### 1.3. Upload e Armazenamento de Mídias Heterogêneas (Resolução Híbrida)
- O envio frequente de fotos de cadernos, gravações de áudio e vídeos curtos por múltiplos grupos simultaneamente gera:
  - Consumo excessivo de franquia de dados móveis em conexões 3G/4G precárias.
  - Gargalos de armazenamento em nuvem e custos de storage.
  - Imagens de baixa resolução ou ilegíveis (iluminação inadequada, foco ruim) que dificultam a avaliação e o OCR futuro.
  - *Delimitação Técnica:* Implementação obrigatória de compressão e redimensionamento de imagens no lado do cliente (client-side compression) antes do upload, além de limites estritos de tamanho de arquivo.

### 1.4. Custos e Latência de Inteligência Artificial
- A geração dinâmica de quizzes, a moderação automatizada de mídias (visão computacional e NLP) e a adaptação pedagógica baseada na BNCC demandam chamadas constantes a APIs de modelos de linguagem (LLMs).
  - *Delimitação Técnica:* Risco de custos elevados por requisição e latência perceptível em horários de pico escolar. Mecanismos de cache agressivo de perguntas, geração em lote assíncrona e pré-processamento são mandatórios.

---

## 2. Limitações Operacionais e Pedagógicas

### 2.1. Dinâmica do Modo Compartilhado em Sala
- **Divergências Intra-grupo:** No Modo Compartilhado, onde 2 a 4 alunos usam um único aparelho e a pontuação é igualitária, existe o risco do fenômeno "passageiro livre" (*free-rider*), onde apenas um aluno realiza a atividade enquanto os demais se abstêm.
  - *Delimitação Pedagógica:* O app fornece a mecânica de sincronização justa de pontos, mas a mediação presencial e a alternância de papéis (*Comunicador*, *Curador*, *Revisor*) dependem da supervisão pedagógica do professor.

### 2.2. Moderação Descentralizada e Liderança Discente
- O modelo propõe que "Líderes de Turma" atuem na esteira de aprovação após a triagem da IA.
  - *Limitação:* Nem todas as turmas possuem maturidade socioemocional para exercer moderação sem viés pessoal, panelinhas ou omissão.
  - *Delimitação Operacional:* A delegação de aprovação para alunos deve ser sempre opcional e configurável pelo docente por turma ou disciplina. O professor mantém papel de superadministrador com histórico de auditoria para reverter qualquer aprovação ou rejeição indevida.

---

## 3. Limitações de Integração e Dependências Externas

### 3.1. Integração com a API `bncc.dev` e Hub Geral
- A geração de trilhas e quizzes alinhados à Base Nacional Comum Curricular depende da disponibilidade, estabilidade e atualização de esquemas da API externa `bncc.dev`.
  - *Delimitação:* O sistema deve operar com uma base local (fallback) de competências e habilidades mapeadas da BNCC para garantir funcionamento mesmo em caso de indisponibilidade do serviço externo.

### 3.2. Importação de Dados Escolares (SIGEs)
- A sincronização oficial de turmas, séries e matrículas esbarra na fragmentação dos Sistemas Integrados de Gestão Escolar (SIGE) adotados por diferentes redes estaduais, municipais e privadas.
  - *Delimitação:* O sistema deve disponibilizar um modelo flexível de importação via planilhas padronizadas (CSV/XLSX) e cadastro manual, antes de prever integrações diretas via API com sistemas legados heterogêneos.

---

## 4. Conformidade e Privacidade (LGPD / Marco Legal de Menores)

- **Tratamento de Dados Sensíveis de Menores:** A plataforma processa dados pessoais de crianças e adolescentes (identificação escolar, fotos de perfil, gravações de áudio/vídeo, fotos de cadernos e registros de desempenho acadêmico).
  - *Delimitações Regulatórias:*
    - Exigência de consentimento prévio e informado de pais ou responsáveis legais conforme o Art. 14 da LGPD (Lei 13.709/2018).
    - Proibição estrita de publicidade direcionada ou monetização de perfis comportamentais.
    - Esteira obrigatória de moderação e revisão institucional para fotos e avatares antes de qualquer exibição pública no ecossistema escolar.
    - Não exposição de rankings públicos de desempenho ou métricas de vaidade.

---

## 5. Delimitação de Escopo: MVP vs. Versões Futuras

A tabela abaixo delimita formalmente o que faz parte do escopo da Prova de Conceito / MVP e o que fica reservado para fases subsequentes:

| Funcionalidade / Componente | Escopo do MVP (React + Node/Express + Mock Data) | Versões Futuras (Produção) |
|---|---|---|
| **Arquitetura & Persistência** | Frontend React SPA consumindo API REST Node.js/Express com dados mockados em memória/JSON. | Banco de dados relacional/NoSQL, autenticação JWT/OAuth2 e orquestração em nuvem. |
| **Modo Compartilhado** | Simulação da vinculação de 2 a 4 perfis em uma mesma sessão de quiz com pontuação compartilhada refletida nos perfis mockados. | Sincronização em tempo real via WebSockets / WebRTC entre múltiplos dispositivos conectados à mesma sala. |
| **Modo Foco & Produtividade** | Timer Pomodoro nativo na interface e modo de visualização em tela cheia com supressão de notificações internas. | Integração com APIs nativas de bloqueio do sistema operacional (Android/iOS via wrapper nativo). |
| **Resolução Híbrida** | Upload e visualização de imagens/prints de resoluções manuais nos desafios. | OCR inteligente com IA para transcrição e pré-avaliação automática de respostas manuscritas. |
| **Papéis (Curador, Comunicador, Revisor)** | Interface com identificação visual dos papéis e fluxos diferenciados de visualização de tarefas. | Algoritmos de recomendação de papéis baseados no histórico de interação do estudante. |
| **Gratidão Privada & Barra da Turma** | Notificações de impacto silencioso simuladas e barra de progresso cumulativa coletiva da turma. | Pipeline de eventos assíncronos e processamento de analytics para geração de relatórios de empatia. |
| **Moderação em Camadas** | Simulação da fila de moderação com interface para Líder de Turma / Professor aprovar/reprovar conteúdos. | Pipeline real com IA de moderação de texto/imagem integrada antes da esteira humana. |
| **Hub BNCC & Geração de Quizzes** | Estrutura de tópicos curriculares com quizzes pré-definidos baseados na taxonomia da BNCC. | Integração em tempo real com API `bncc.dev` e LLMs para geração on-demand de conteúdo. |
