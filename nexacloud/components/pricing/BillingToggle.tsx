// components/pricing/BillingToggle.tsx
'use client';

import { useState } from 'react';
import styles from './BillingToggle.module.css';

interface BillingToggleProps {
  onToggle: (isYearly: boolean) => void;
}

export default function BillingToggle({ onToggle }: BillingToggleProps) {
  const [isYearly, setIsYearly] = useState(false);

  const toggle = () => {
    const next = !isYearly;
    setIsYearly(next);
    onToggle(next);
  };

  return (
    <div className={styles.wrapper}>
      <span className={[styles.label, !isYearly ? styles.labelActive : ''].filter(Boolean).join(' ')}>
        Monthly
      </span>
      <button
        className={[styles.track, isYearly ? styles.trackActive : ''].filter(Boolean).join(' ')}
        onClick={toggle}
        aria-label="Toggle billing period"
      >
        <div className={[styles.thumb, isYearly ? styles.thumbActive : ''].filter(Boolean).join(' ')} />
      </button>
      <span className={[styles.label, isYearly ? styles.labelActive : ''].filter(Boolean).join(' ')}>
        Yearly
      </span>
      {isYearly && <span className={styles.saveBadge}>Save 20%</span>}
    </div>
  );
}
