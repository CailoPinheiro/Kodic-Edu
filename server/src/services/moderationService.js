const INAPPROPRIATE_TERMS = [
  'violencia', 'odio', 'arma', 'porn', 'ofensa', 'xingamento', 'trapaca'
];

class ModerationService {
  static evaluateContent({ title, text, url }) {
    const combinedContent = `${title || ''} ${text || ''} ${url || ''}`.toLowerCase();
    
    for (const term of INAPPROPRIATE_TERMS) {
      if (combinedContent.includes(term)) {
        return {
          aiApproved: false,
          aiStatus: 'Rejeitado por IA (Termo Inadequado Detectado)',
          humanStatus: 'Bloqueado na Camada 1',
          riskLevel: 'high'
        };
      }
    }

    return {
      aiApproved: true,
      aiStatus: 'Aprovado por IA (Filtro de Segurança OK)',
      humanStatus: 'Aguardando validação do Líder de Turma',
      riskLevel: 'low'
    };
  }
}

module.exports = ModerationService;
