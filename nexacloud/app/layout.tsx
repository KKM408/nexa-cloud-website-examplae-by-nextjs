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
    template: '%s | Zhang.dev',
    default: 'Zhang.dev — Full-Stack Development Blog',
  },
  description:
    'Thoughts on full-stack development, open source, and building things on the web.',
  keywords: ['full-stack', 'Next.js', 'NestJS', 'TypeScript', 'React', 'web development'],
  authors: [{ name: 'Zhang' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Zhang.dev',
    title: 'Zhang.dev — Full-Stack Development Blog',
    description: 'Thoughts on full-stack development, open source, and building things on the web.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zhang.dev',
    description: 'Thoughts on full-stack development, open source, and building things on the web.',
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
