import Link from 'next/link';
import styles from './CategorySidebar.module.css';

const CATEGORIES = [
  // { label: '关注', slug: 'follow', icon: BookmarkIcon },
  { label: '综合', slug: '', icon: GridIcon },
  { label: '后端', slug: 'backend', icon: ServerIcon },
  { label: '前端', slug: 'frontend', icon: CodeIcon },
  { label: 'AI', slug: 'ai', icon: SparkleIcon },
];

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function ServerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export default function CategorySidebar({ activeCategory }: { activeCategory?: string }) {
  return (
    <nav className={styles.sidebar}>
      {CATEGORIES.map(({ label, slug, icon: Icon }) => {
        const isActive = (activeCategory ?? '') === slug;
        const href = slug ? `/?category=${slug}` : '/';
        return (
          <Link
            key={label}
            href={href}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>
              <Icon />
            </span>
            <span className={styles.label}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
