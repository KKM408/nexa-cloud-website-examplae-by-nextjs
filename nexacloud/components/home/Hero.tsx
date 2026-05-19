// components/home/Hero.tsx
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.badge}>
          <Badge>✨ Now with AI-powered collaboration</Badge>
        </div>
        <h1 className={styles.title}>
          Scale without{' '}
          <span className="gradient-text">limits.</span>
        </h1>
        <p className={styles.subtitle}>
          NexaCloud is the enterprise cloud platform that helps teams ship faster, collaborate smarter, and scale confidently.
        </p>
        <div className={styles.actions}>
          <Button href="#" size="large">
            Start for free →
          </Button>
          <Button href="#" variant="secondary" size="large">
            Watch demo
          </Button>
        </div>
        <div className={styles.mockup}>
          <div className={styles.mockupBar}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
          <div className={styles.mockupContent}>
            // NexaCloud Dashboard — coming soon
          </div>
        </div>
      </div>
    </section>
  );
}
