// app/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '@/lib/mdx';
import MDXRenderer from '@/components/blog/MDXRenderer';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return { title: post.title, description: post.excerpt };
  } catch {
    return { title: 'Post not found' };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: 'rgba(102,126,234,0.12)',
                color: '#a5b4fc',
                border: '1px solid rgba(102,126,234,0.2)',
                padding: '2px 10px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '16px',
          }}
        >
          {post.title}
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', display: 'flex', gap: '16px' }}>
          <span>{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
      <MDXRenderer source={post!.content} />
    </div>
  );
}
