import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Outfit, Playfair_Display, JetBrains_Mono } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1a2e',
};

export const metadata: Metadata = {
  title: 'LEXORA — Understand the fine print. Keep the human in control.',
  description: 'AI-powered legal document intelligence workspace that transforms complex legal documents into understandable, navigable, evidence-backed information. Not a replacement for legal advice.',
  keywords: ['legal document analysis', 'contract review', 'AI legal assistant', 'document intelligence'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
