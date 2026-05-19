// components/home/FeatureGrid.tsx
import type { Feature } from '@/types';
import styles from './FeatureGrid.module.css';

const features: Feature[] = [
  { icon: '⚡', title: 'Lightning Fast', description: 'Deploy in seconds with our globally distributed edge network. 99.9% uptime guaranteed.' },
  { icon: '🔒', title: 'Enterprise Security', description: 'SOC 2 Type II certified. End-to-end encryption, SSO, and granular access controls.' },
  { icon: '🔗', title: '500+ Integrations', description: 'Connect your existing tools. Slack, GitHub, Jira, Salesforce and hundreds more.' },
  { icon: '📊', title: 'Real-time Analytics', description: 'Actionable insights into team performance, resource usage, and business metrics.' },
  { icon: '🤖', title: 'AI-Powered', description: 'Intelligent automation, smart suggestions, and AI assistants built into every workflow.' },
  { icon: '🌍', title: 'Global Scale', description: 'Multi-region deployment with automatic failover. Your data, wherever your team is.' },
];

export default function FeatureGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className="section-title">
          Everything your team <span className="gradient-text">needs</span>
        </h2>
        <p className="section-subtitle">
          Purpose-built tools that enterprise teams rely on to ship faster and scale confidently.
        </p>
        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.title} className={styles.card}>
              <span className={styles.icon}>{f.icon}</span>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.desc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
