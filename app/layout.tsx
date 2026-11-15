import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { site } from '../lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#151c18' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
