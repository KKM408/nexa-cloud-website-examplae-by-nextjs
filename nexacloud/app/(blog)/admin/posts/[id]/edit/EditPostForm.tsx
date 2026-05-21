'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/types';
import styles from '../../new/page.module.css';

export default function EditPostForm({ post }: { post: Post }) {
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
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? 'Failed to update post');
        return;
      }

      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Title
        <input name="title" required defaultValue={post.title} className={styles.input} />
      </label>
      <label className={styles.label}>
        Slug
        <input name="slug" required defaultValue={post.slug} className={styles.input} />
      </label>
      <label className={styles.label}>
        Category ID
        <input name="categoryId" type="number" required defaultValue={post.category.id} className={styles.input} />
      </label>
      <label className={styles.label}>
        Excerpt
        <textarea name="excerpt" required rows={3} defaultValue={post.excerpt} className={styles.textarea} />
      </label>
      <label className={styles.label}>
        Content (Markdown)
        <textarea name="content" required rows={16} defaultValue={post.content} className={styles.textarea} />
      </label>
      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input name="published" type="checkbox" defaultChecked={post.published} /> Published
        </label>
        <label className={styles.checkboxLabel}>
          <input name="featured" type="checkbox" defaultChecked={post.featured} /> Featured
        </label>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formActions}>
        <button type="button" onClick={() => router.back()} className={styles.btnCancel}>Cancel</button>
        <button type="submit" disabled={loading} className={styles.btnSubmit}>
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
