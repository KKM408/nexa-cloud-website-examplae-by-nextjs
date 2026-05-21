import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import EditPostForm from './EditPostForm';
import type { Post } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('blog_token')?.value;
  if (!token) redirect('/admin/login');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/api/posts?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) notFound();
  const { posts } = await res.json();
  const post: Post | undefined = posts.find((p: Post) => p.id === Number(id));
  if (!post) notFound();

  return (
    <section className="section container" style={{ maxWidth: '720px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '40px' }}>Edit Post</h1>
      <EditPostForm post={post} />
    </section>
  );
}
