import type { Metadata } from 'next';
import Link from 'next/link';
import PersonalHero from '@/components/blog/PersonalHero';
import BlogCard from '@/components/blog/BlogCard';
import { getFeaturedPosts } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Zhang.dev — Full-Stack Development Blog',
};

export default async function HomePage() {
  const featured = await getFeaturedPosts();

  return (
    <>
      <PersonalHero />
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '48px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Featured Posts</h2>
            <Link href="/posts" style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {featured.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
