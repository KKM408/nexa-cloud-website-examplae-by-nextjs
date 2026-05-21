'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function NewPostPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;
    const getChecked = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).checked;

    const body = {
      title: getValue('title'),
      slug: getValue('slug'),
      excerpt: getValue('excerpt'),
      content: getValue('content'),
      categoryId: Number(getValue('categoryId')),
      published: getChecked('published'),
      featured: getChecked('featured'),
    };

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? 'Failed to create post');
        return;
      }

      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section container" style={{ maxWidth: '720px' }}>
      <h1 className={styles.title}>New Post</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Title
          <input name="title" required className={styles.input} placeholder="Post title" />
        </label>
        <label className={styles.label}>
          Slug
          <input name="slug" required className={styles.input} placeholder="post-slug" />
        </label>
        <label className={styles.label}>
          Category ID
          <input name="categoryId" type="number" required defaultValue="1" className={styles.input} />
        </label>
        <label className={styles.label}>
          Excerpt
          <textarea name="excerpt" required rows={3} className={styles.textarea} placeholder="Short description..." />
        </label>
        <label className={styles.label}>
          Content (Markdown)
          <textarea name="content" required rows={16} className={styles.textarea} placeholder="# Your post content..." />
        </label>
        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input name="published" type="checkbox" defaultChecked /> Published
          </label>
          <label className={styles.checkboxLabel}>
            <input name="featured" type="checkbox" /> Featured
          </label>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formActions}>
          <button type="button" onClick={() => router.back()} className={styles.btnCancel}>Cancel</button>
          <button type="submit" disabled={loading} className={styles.btnSubmit}>
            {loading ? 'Creating…' : 'Create Post'}
          </button>
        </div>
      </form>
    </section>
  );
}
