import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllSlugs } from '@/lib/api';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return { title: post.title, description: post.excerpt };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export const revalidate = 60;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className={styles.article}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category.name}</span>
            <span className={styles.dot}>·</span>
            <span>{post.readingTime} min read</span>
            <span className={styles.dot}>·</span>
            <time>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.tags}>
            {post.tags.map(({ tag }) => (
              <a key={tag.id} href={`/posts?tag=${tag.slug}`} className={styles.tag}>
                #{tag.name}
              </a>
            ))}
          </div>
          <div className={styles.author}>
            <div className={styles.authorAvatar}>
              {post.author.name[0]}
            </div>
            <div>
              <div className={styles.authorName}>{post.author.name}</div>
              {post.author.bio && <div className={styles.authorBio}>{post.author.bio}</div>}
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
