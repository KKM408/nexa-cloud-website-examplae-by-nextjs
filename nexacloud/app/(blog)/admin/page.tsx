import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import type { PostsResponse } from '@/lib/types';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function fetchAdminPosts(token: string): Promise<PostsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/api/posts?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('blog_token')?.value;
  if (!token) redirect('/admin/login');

  let data: PostsResponse;
  try {
    data = await fetchAdminPosts(token);
  } catch {
    return <p style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Failed to load posts.</p>;
  }

  return (
    <section className={`section container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.actions}>
          <Link href="/admin/posts/new" className={styles.btnPrimary}>+ New Post</Link>
          <LogoutButton />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Views</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.posts.map((post) => (
            <tr key={post.id}>
              <td>
                <Link href={`/posts/${post.slug}`} className={styles.postLink}>
                  {post.title}
                </Link>
              </td>
              <td className={styles.muted}>{post.category.name}</td>
              <td>
                <span className={post.published ? styles.badgePublished : styles.badgeDraft}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className={styles.muted}>{post.views}</td>
              <td className={styles.muted}>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td className={styles.rowActions}>
                <Link href={`/admin/posts/${post.id}/edit`} className={styles.btnEdit}>Edit</Link>
                <DeleteButton id={post.id} token={token} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button type="submit" className={styles.btnSecondary}>Logout</button>
    </form>
  );
}

function DeleteButton({ id, token }: { id: number; token: string }) {
  async function deletePost() {
    'use server';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    await fetch(`${apiUrl}/api/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin');
  }

  return (
    <form action={deletePost}>
      <button type="submit" className={styles.btnDelete}>Delete</button>
    </form>
  );
}
