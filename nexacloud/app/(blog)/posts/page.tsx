import type { Metadata } from 'next';
import BlogCard from '@/components/blog/BlogCard';
import { getPosts } from '@/lib/api';

export const metadata: Metadata = { title: 'Posts' };

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; search?: string }>;
}

export default async function PostsPage({ searchParams }: Props) {
  const { page: pageStr, category, tag, search } = await searchParams;
  const page = pageStr ? Number(pageStr) : 1;

  const { posts, total, totalPages } = await getPosts({ page, limit: 9, category, tag, search });

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '48px' }}>All Posts</h1>

        {search && (
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            {total} result{total !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
          </p>
        )}

        {posts.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No posts found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {posts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/posts?page=${p}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: p === page ? 'var(--color-primary)' : 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: p === page ? '#fff' : 'var(--color-text-muted)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
