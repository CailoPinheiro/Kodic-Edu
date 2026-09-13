import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    framework: 'Next.js App Router',
    appName: 'Kodic Edu Server',
    version: '3.0.0',
    timestamp: new Date().toISOString()
  });
}
