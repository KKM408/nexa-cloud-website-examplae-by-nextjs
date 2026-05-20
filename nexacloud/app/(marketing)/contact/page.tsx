import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the NexaCloud team.',
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <span
            style={{
              background: 'rgba(102,126,234,0.12)',
              border: '1px solid rgba(102,126,234,0.25)',
              borderRadius: '100px',
              color: '#a5b4fc',
              display: 'inline-block',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px',
              padding: '4px 14px',
            }}
          >
            Contact Us
          </span>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Let&apos;s{' '}
            <span className="gradient-text">talk</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '17px', lineHeight: 1.7 }}>
            Have a question or want to learn more about NexaCloud? We&apos;d love to hear from you.
          </p>
        </div>

        <div
          style={{
            background: 'var(--color-surface)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '40px',
          }}
        >
          <ContactForm />
        </div>

        <div
          style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            marginTop: '32px',
          }}
        >
          {[
            { label: 'Email', value: 'hello@nexacloud.io' },
            { label: 'Response time', value: 'Within 24 hours' },
            { label: 'Support', value: 'Mon – Fri, 9–18 UTC' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: 600 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
