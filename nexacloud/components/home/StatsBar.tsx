// components/home/StatsBar.tsx
import type { Stat } from '@/types';
import styles from './StatsBar.module.css';

const stats: Stat[] = [
  { value: '50K+', label: 'Teams worldwide' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '500+', label: 'Integrations' },
  { value: '4.9★', label: 'Average rating' },
];

export default function StatsBar() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
