// components/home/CTASection.tsx
import Link from 'next/link';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Ready to scale without limits?</h2>
        <p className={styles.subtitle}>
          Join 50,000+ teams. Free forever, upgrade when you need.
        </p>
        <div className={styles.actions}>
          <Link href="#" className={styles.btnPrimary}>
            Start for free →
          </Link>
          <Link href="#" className={styles.btnSecondary}>
            Talk to sales
          </Link>
        </div>
        <p className={styles.note}>No credit card required · 14-day Pro trial included</p>
      </div>
    </section>
  );
}
