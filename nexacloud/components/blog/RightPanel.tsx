'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { Post } from '@/lib/types';
import styles from './RightPanel.module.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return '凌晨好';
  if (h < 11) return '早上好';
  if (h < 13) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

export default function RightPanel({ ranking }: { ranking: Post[] }) {
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <aside className={styles.aside}>
      <div className={styles.greetCard}>
        <p className={styles.greet}>{greeting}！</p>
        <p className={styles.sub}>点亮你今天的每一刻</p>
        <Link href="/admin/login" className={styles.loginBtn}>
          去登录
        </Link>
      </div>

      {ranking.length > 0 && (
        <div className={styles.rankCard}>
          <div className={styles.rankHeader}>
            <span className={styles.rankTitle}>文章榜</span>
            <Link href="/posts" className={styles.rankAll}>
              排一排 →
            </Link>
          </div>
          <ol className={styles.rankList}>
            {ranking.map((post, i) => (
              <li key={post.id} className={styles.rankItem}>
                <span
                  className={`${styles.rankNum} ${i < 3 ? styles.rankTop : ''}`}
                  style={i < 3 ? { background: ['#e5382f', '#f97316', '#eab308'][i] } : undefined}
                >
                  {i + 1}
                </span>
                <Link href={`/posts/${post.slug}`} className={styles.rankLink}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </aside>
  );
}
