// components/ui/Badge.tsx
import styles from './Badge.module.css';

export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}
