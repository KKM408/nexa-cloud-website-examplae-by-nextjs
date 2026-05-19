// components/features/ComparisonTable.tsx
import styles from './ComparisonTable.module.css';

const rows = [
  { feature: 'Team members', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Projects', free: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Storage', free: '5 GB', pro: '100 GB', enterprise: 'Custom' },
  { feature: 'AI Assistant', free: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'SSO / SAML', free: '✗', pro: '✗', enterprise: '✓' },
  { feature: 'Audit Logs', free: '✗', pro: '30 days', enterprise: 'Unlimited' },
  { feature: 'SLA', free: '✗', pro: '99.9%', enterprise: '99.99%' },
  { feature: 'Support', free: 'Community', pro: 'Email', enterprise: 'Dedicated CSM' },
];

export default function ComparisonTable() {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Feature</th>
            <th className={styles.planName}>Free</th>
            <th className={styles.planName}>Pro</th>
            <th className={styles.planName}>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature}>
              <td>{row.feature}</td>
              <td className={row.free === '✗' ? styles.no : row.free === '✓' ? styles.yes : ''}>
                {row.free}
              </td>
              <td className={[styles.highlight, row.pro === '✗' ? styles.no : row.pro === '✓' ? styles.yes : ''].join(' ')}>
                {row.pro}
              </td>
              <td className={row.enterprise === '✗' ? styles.no : row.enterprise === '✓' ? styles.yes : ''}>
                {row.enterprise}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
