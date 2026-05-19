// app/(marketing)/features/page.tsx
import type { Metadata } from 'next';
import FeatureDetail from '@/components/features/FeatureDetail';
import ComparisonTable from '@/components/features/ComparisonTable';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore NexaCloud features built for enterprise teams.',
};

const featureBlocks = [
  {
    badge: '⚡ Performance',
    title: 'Deploy at the speed of thought',
    description: 'Our globally distributed edge network means your team works faster no matter where they are. Sub-100ms response times, worldwide.',
    points: ['99.9% uptime SLA with automatic failover', 'CDN-first architecture across 50+ regions', 'Zero-downtime deployments', 'Real-time collaboration without conflicts'],
    icon: '⚡',
    reverse: false,
  },
  {
    badge: '🔒 Security',
    title: 'Enterprise-grade security built in',
    description: "SOC 2 Type II certified from day one. Security is not an afterthought — it's the foundation.",
    points: ['End-to-end encryption at rest and in transit', 'SSO, SAML, and MFA support', 'Granular role-based access control', 'Automated security scanning on every commit'],
    icon: '🔒',
    reverse: true,
  },
  {
    badge: '🤖 AI',
    title: 'AI that actually understands your codebase',
    description: 'NexaCloud AI learns your patterns, suggests improvements, and automates the boring parts so your team focuses on what matters.',
    points: ['Context-aware code review suggestions', 'Automated documentation generation', 'Intelligent test generation', 'Anomaly detection and proactive alerts'],
    icon: '🤖',
    reverse: false,
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="section-title">
          Built for teams that <span className="gradient-text">ship</span>
        </h1>
        <p className="section-subtitle">
          Every feature is designed to remove friction, not add it.
        </p>
      </div>
      {featureBlocks.map((block) => (
        <FeatureDetail key={block.badge} {...block} />
      ))}
      <h2 className="section-title" style={{ textAlign: 'center', marginTop: '80px' }}>
        Compare <span className="gradient-text">plans</span>
      </h2>
      <ComparisonTable />
    </div>
  );
}
