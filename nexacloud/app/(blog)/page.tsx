import type { Metadata } from 'next';
import { getPosts } from '@/lib/api';
import CategorySidebar from '@/components/blog/CategorySidebar';
import PostFeed from '@/components/blog/PostFeed';
import RightPanel from '@/components/blog/RightPanel';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Zhang.dev — Full-Stack Development Blog',
};

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams;

  const { posts } = await getPosts({ category });
  const ranking = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className={styles.layout}>
      <CategorySidebar activeCategory={category} />
      <PostFeed posts={posts} activeCategory={category} />
      <RightPanel ranking={ranking} />
    </div>
  );
}
