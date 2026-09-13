import './globals.css';
import React from 'react';
import { AuthProvider } from '@/frontend/context/AuthContext';
import { ThemeProvider } from '@/frontend/context/ThemeContext';

export const metadata = {
  title: 'Kodic Edu — O Celular como Ferramenta de Engajamento Coletivo',
  description: 'Ecossistema gamificado de aprendizagem cooperativa e inclusão'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased selection:bg-fuchsia-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
