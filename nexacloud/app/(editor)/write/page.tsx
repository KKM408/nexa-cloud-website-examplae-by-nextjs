'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const MarkdownEditor = dynamic(() => import('@/components/editor/MarkdownEditor'), { ssr: false });

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [publishing, setPublishing] = useState(false);

  async function handlePublish() {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);
    try {
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w一-龥-]/g, '')
        .slice(0, 60);

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt: content.replace(/#+\s/g, '').slice(0, 150),
          content,
          categoryId: 1,
          published: true,
          featured: false,
        }),
      });

      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => router.push('/admin'), 800);
      }
    } finally {
      setPublishing(false);
    }
  }

  async function handleDraft() {
    if (!title.trim()) return;
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w一-龥-]/g, '')
      .slice(0, 60);

    await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        excerpt: content.replace(/#+\s/g, '').slice(0, 150),
        content,
        categoryId: 1,
        published: false,
        featured: false,
      }),
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <input
          className={styles.titleInput}
          placeholder="输入文章标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
        <div className={styles.actions}>
          {saveStatus === 'saved' && <span className={styles.saveStatus}>保存成功</span>}
          <button className={styles.btnDraft} onClick={handleDraft}>
            草稿箱
          </button>
          <button className={styles.btnPublish} onClick={handlePublish} disabled={publishing}>
            发布
          </button>
        </div>
      </header>
      <div className={styles.editorWrap}>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
