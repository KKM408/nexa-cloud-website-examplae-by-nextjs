'use client';

import { useState, useRef, useEffect } from 'react';
import type { Post } from '@/lib/types';
import PostListItem from './PostListItem';
import styles from './PostFeed.module.css';

const TABS = ['推荐', '最新'] as const;
type Tab = (typeof TABS)[number];

const SUBCATEGORIES: Record<string, string[]> = {
  frontend: ['全部', '前端', 'JavaScript', 'Vue.js', 'React.js', 'CSS', '面试'],
  backend:  ['全部', '后端', 'Node.js', 'Java', 'Go', 'Python', '数据库', '面试'],
  ai:       ['全部', 'AI', '机器学习', '深度学习', 'LLM', 'ChatGPT', '提示词'],
};

interface Props {
  posts: Post[];
  activeCategory?: string;
}

export default function PostFeed({ posts, activeCategory }: Props) {
  const [tab, setTab] = useState<Tab>('推荐');
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const dropRef = useRef<HTMLDivElement>(null);
  const subcategories = activeCategory ? (SUBCATEGORIES[activeCategory] ?? null) : null;
  const showDropdown = !!subcategories;

  useEffect(() => {
    setSelectedTag('');
    setDropOpen(false);
  }, [activeCategory]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const baseList =
    tab === '最新'
      ? posts.filter((p) => new Date(p.createdAt).getTime() >= threeDaysAgo)
      : posts;

  const list =
    selectedTag && selectedTag !== '全部'
      ? baseList.filter((p) =>
          p.tags.some(({ tag }) => tag.name === selectedTag || tag.slug === selectedTag.toLowerCase().replace(/\./g, ''))
        )
      : baseList;
  const displayLabel = selectedTag || '全部';

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`${styles.tab} ${tab === t ? styles.activeTab : ''}`}
            >
              {t}
            </button>
          ))}
        </div>

        {showDropdown && (
          <div className={styles.dropWrapper} ref={dropRef}>
            <div
              className={`${styles.dropTrigger} ${dropOpen ? styles.dropTriggerOpen : ''}`}
              onClick={() => setDropOpen((v) => !v)}
            >
              <input
                readOnly
                value={displayLabel}
                className={styles.dropInput}
              />
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={styles.dropChevron}
                style={{ transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {dropOpen && subcategories && (
              <ul className={styles.dropMenu}>
                {subcategories.map((name) => (
                  <li
                    key={name}
                    className={`${styles.dropItem} ${(selectedTag || '全部') === name ? styles.dropItemActive : ''}`}
                    onClick={() => { setSelectedTag(name === '全部' ? '' : name); setDropOpen(false); }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className={styles.list}>
        {list.length === 0 ? (
          <p className={styles.empty}>暂无文章</p>
        ) : (
          list.map((post, i) => <PostListItem key={post.id} post={post} index={i} />)
        )}
      </div>
    </div>
  );
}
