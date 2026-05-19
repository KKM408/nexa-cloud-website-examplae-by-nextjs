// app/(marketing)/page.tsx
import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import FeatureGrid from '@/components/home/FeatureGrid';
import StatsBar from '@/components/home/StatsBar';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'NexaCloud — Cloud Collaboration Platform',
  description: 'The cloud collaboration platform built for modern enterprises. Scale without limits.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <Testimonials />
      <CTASection />
    </>
  );
}
