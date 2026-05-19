// app/(marketing)/blog/page.tsx
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on Next.js, cloud infrastructure, and engineering best practices from the NexaCloud team.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="section-title">
          From the <span className="gradient-text">NexaCloud</span> blog
        </h1>
        <p className="section-subtitle">
          Engineering insights, product updates, and best practices for modern teams.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}
