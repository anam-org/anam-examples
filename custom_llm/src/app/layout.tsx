import { AnamContextProvider } from '@/contexts/AnamContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getSessionToken } from '@/lib/server-lib';

const inter = Inter({ subsets: ['latin'] });

const API_KEY = process.env.API_KEY || '';

export const metadata: Metadata = {
  title: 'ANAM',
  description: 'ANAM - Digital Humans',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // this function runs server side
  const sessionToken = await getSessionToken(API_KEY);
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen py-4 px-2 md:p-20 justify-center">
          <AnamContextProvider sessionToken={sessionToken}>
            {children}
          </AnamContextProvider>
        </main>
      </body>
    </html>
  );
}
