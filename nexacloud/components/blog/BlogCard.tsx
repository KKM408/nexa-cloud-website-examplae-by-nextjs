import Link from 'next/link';
import type { Post } from '@/lib/types';
import styles from './BlogCard.module.css';

export default function BlogCard({ slug, title, excerpt, createdAt, category, tags, readingTime }: Post) {
  return (
    <Link href={`/posts/${slug}`} className={styles.card}>
      <div className={styles.body}>
        <div className={styles.tags}>
          <span className={styles.category}>{category.name}</span>
          {tags.slice(0, 2).map(({ tag }) => (
            <span key={tag.id} className={styles.tag}>
              {tag.name}
            </span>
          ))}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.meta}>
          <span>{new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
