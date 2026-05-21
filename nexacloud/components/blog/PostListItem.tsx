import Link from 'next/link';
import type { Post } from '@/lib/types';
import styles from './PostListItem.module.css';

const COVER_COLORS = [
  ['#1e40af', '#3b82f6'],
  ['#065f46', '#10b981'],
  ['#7c2d12', '#f97316'],
  ['#4c1d95', '#8b5cf6'],
  ['#134e4a', '#14b8a6'],
  ['#1e3a5f', '#60a5fa'],
];

export default function PostListItem({ post, index = 0 }: { post: Post; index?: number }) {
  const { slug, title, excerpt, author, category, tags, readingTime, views } = post;
  const [from, to] = COVER_COLORS[index % COVER_COLORS.length];

  return (
    <article className={styles.item}>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.author}>{author.name}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.category}>{category?.name ?? '未分类'}</span>
        </div>
        <Link href={`/posts/${slug}`} className={styles.title}>
          {title}
        </Link>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.footer}>
          <span className={styles.stat}>
            <EyeIcon /> {views}
          </span>
          <span className={styles.stat}>
            <ClockIcon /> {readingTime} min
          </span>
          <div className={styles.tags}>
            {tags.slice(0, 2).map(({ tag }) => (
              <span key={tag.id} className={styles.tag}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className={styles.cover}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-hidden
      >
        <span className={styles.coverText}>{(category?.name ?? '??').slice(0, 2)}</span>
      </div>
    </article>
  );
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
