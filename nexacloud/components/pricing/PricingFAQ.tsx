// components/pricing/PricingFAQ.tsx
'use client';

import { useState } from 'react';
import styles from './PricingFAQ.module.css';

const faqs = [
  {
    q: 'Can I change my plan later?',
    a: 'Yes. You can upgrade or downgrade at any time. Changes take effect immediately, and we pro-rate billing automatically.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express) and wire transfer for Enterprise plans.',
  },
  {
    q: 'Is there a free trial?',
    a: "Every account starts with a 14-day Pro trial, no credit card required. After the trial, you'll be moved to the Free plan unless you upgrade.",
  },
  {
    q: 'What is your refund policy?',
    a: "If you're not satisfied within the first 30 days, contact us for a full refund. No questions asked.",
  },
  {
    q: 'How does Enterprise pricing work?',
    a: 'Enterprise pricing is custom-built around your team size, usage, and requirements. Contact our sales team for a tailored quote.',
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>
        Frequently asked <span className="gradient-text">questions</span>
      </h2>
      <div className={styles.list}>
        {faqs.map((faq, i) => (
          <div key={faq.q} className={styles.item}>
            <button
              className={styles.question}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
              <span className={[styles.chevron, open === i ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
                ▾
              </span>
            </button>
            {open === i && <p className={styles.answer}>{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
