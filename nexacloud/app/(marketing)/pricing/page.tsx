// app/(marketing)/pricing/page.tsx
'use client';

import { useState } from 'react';
import type { PricingPlan } from '@/types';
import PricingCard from '@/components/pricing/PricingCard';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingFAQ from '@/components/pricing/PricingFAQ';

const plans: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for small teams getting started.',
    features: ['Up to 5 team members', '3 projects', '5 GB storage', 'Community support', 'Basic analytics'],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 278,
    description: 'Everything you need for growing teams.',
    features: ['Unlimited team members', 'Unlimited projects', '100 GB storage', 'AI Assistant', 'Email support', '99.9% SLA', '30-day audit logs'],
    cta: 'Start Pro trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'Custom solutions for large organizations.',
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated CSM', '99.99% SLA', 'Custom storage', 'Unlimited audit logs', 'On-premise option'],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="section-title">
          Simple, <span className="gradient-text">transparent</span> pricing
        </h1>
        <p className="section-subtitle">
          Start free. Upgrade when you need. Cancel anytime.
        </p>
      </div>
      <BillingToggle onToggle={setIsYearly} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
        ))}
      </div>
      <PricingFAQ />
    </div>
  );
}
