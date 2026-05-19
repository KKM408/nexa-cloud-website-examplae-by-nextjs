// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | NexaCloud',
    default: 'NexaCloud — Cloud Collaboration Platform',
  },
  description: 'The cloud collaboration platform built for modern enterprises. Scale without limits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
