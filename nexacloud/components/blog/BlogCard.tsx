// components/blog/BlogCard.tsx
import Link from 'next/link';
import type { BlogPost } from '@/types';
import styles from './BlogCard.module.css';

type BlogCardProps = Omit<BlogPost, 'content'>;

const tagEmojis: Record<string, string> = {
  nextjs: '▲',
  react: '⚛',
  performance: '⚡',
  'server-components': '🖥',
  'app-router': '🗺',
  optimization: '🔧',
  tutorial: '📖',
};

export default function BlogCard({ slug, title, date, tags, excerpt, author }: BlogCardProps) {
  const emoji = tagEmojis[tags[0]] ?? '📝';

  return (
    <Link href={`/blog/${slug}`} className={styles.card}>
      <div className={styles.cover}>{emoji}</div>
      <div className={styles.body}>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.meta}>
          <span>{author}</span>
          <span>{new Date(date).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
    </Link>
  );
}
