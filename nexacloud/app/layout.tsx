// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | NexaCloud',
    default: 'NexaCloud — Cloud Collaboration Platform',
  },
  description:
    'The cloud collaboration platform built for modern enterprises. Scale without limits.',
  keywords: ['cloud', 'collaboration', 'enterprise', 'SaaS', 'team productivity'],
  authors: [{ name: 'NexaCloud Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexacloud.example.com',
    siteName: 'NexaCloud',
    title: 'NexaCloud — Cloud Collaboration Platform',
    description: 'The cloud collaboration platform built for modern enterprises.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaCloud',
    description: 'The cloud collaboration platform built for modern enterprises.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
