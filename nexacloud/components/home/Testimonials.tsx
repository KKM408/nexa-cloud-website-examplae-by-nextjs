// components/home/Testimonials.tsx
import type { Testimonial } from '@/types';
import styles from './Testimonials.module.css';

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'Acme Corp',
    content: 'NexaCloud transformed how our 200-person engineering team collaborates. Deployment time went from hours to minutes.',
    avatar: '👩‍💻',
  },
  {
    name: 'Marcus Johnson',
    role: 'VP Engineering',
    company: 'TechFlow',
    content: 'The AI features alone saved us 15 hours per week in code reviews and documentation. This is the future.',
    avatar: '👨‍🔬',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Engineering Lead',
    company: 'Nexus Labs',
    content: 'Migration took 2 days, not 2 months like we feared. The support team was exceptional throughout.',
    avatar: '👩‍🚀',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className="section-title">
          Loved by <span className="gradient-text">engineering teams</span>
        </h2>
        <p className="section-subtitle">
          Join 50,000+ teams that trust NexaCloud to power their most critical workflows.
        </p>
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.name} className={styles.card}>
              <p className={styles.quote}>"{t.content}"</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.avatar}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
