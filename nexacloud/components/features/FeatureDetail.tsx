// components/features/FeatureDetail.tsx
import Badge from '@/components/ui/Badge';
import styles from './FeatureDetail.module.css';

interface FeatureDetailProps {
  badge: string;
  title: string;
  description: string;
  points: string[];
  icon: string;
  reverse?: boolean;
}

export default function FeatureDetail({
  badge,
  title,
  description,
  points,
  icon,
  reverse = false,
}: FeatureDetailProps) {
  return (
    <div className={[styles.block, reverse ? styles.reverse : ''].filter(Boolean).join(' ')}>
      <div>
        <div className={styles.badge}>
          <Badge>{badge}</Badge>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
        <ul className={styles.points}>
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <div className={styles.visual}>{icon}</div>
    </div>
  );
}
