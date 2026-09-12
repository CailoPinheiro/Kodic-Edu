import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    compliance: 'LGPD & Privacy by Design',
    dataMinimization: 'Coleta estritamente restrita a nome, série, turma e progresso pedagógico.',
    minorsProtection: 'Ambiente fechado escolar sob custódia e consentimento da instituição de ensino.',
    advertising: 'Plataforma 100% livre de publicidade comercial e sem monetização de dados.',
    aiProcessing: 'Textos analisados pela moderação não são retidos permanentemente nem usados para treinamento de modelos de terceiros.',
    bnccDataFlow: 'Consultas à bncc.dev são públicas e unidirecionais; nenhum dado de alunos trafega para APIs curriculares externas.'
  });
}
