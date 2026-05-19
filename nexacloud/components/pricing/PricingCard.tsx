// components/pricing/PricingCard.tsx
import Link from 'next/link';
import type { PricingPlan } from '@/types';
import styles from './PricingCard.module.css';

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
}

export default function PricingCard({ plan, isYearly }: PricingCardProps) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div className={[styles.card, plan.highlighted ? styles.highlighted : ''].filter(Boolean).join(' ')}>
      {plan.highlighted && <div className={styles.highlightedBadge}>Most Popular</div>}
      <div className={styles.name}>{plan.name}</div>
      <div className={styles.desc}>{plan.description}</div>
      <div className={styles.price}>
        {price === null ? (
          <span className={styles.custom}>Custom</span>
        ) : (
          <>
            <span className={styles.amount}>${price}</span>
            <span className={styles.period}>/{isYearly ? 'yr' : 'mo'}</span>
          </>
        )}
      </div>
      <ul className={styles.features}>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <Link
        href="#"
        className={[styles.cta, plan.highlighted ? styles.ctaPrimary : styles.ctaSecondary].join(' ')}
      >
        {plan.cta}
      </Link>
    </div>
  );
}
