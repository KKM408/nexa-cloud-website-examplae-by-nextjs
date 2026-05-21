import type { Post, PostsResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getFeaturedPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts/featured`, {
    next: { revalidate: 60, tags: ['posts'] },
  });
  if (!res.ok) throw new Error('Failed to fetch featured posts');
  return res.json();
}

export async function getPosts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<PostsResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.category) query.set('category', params.category);
  if (params?.tag) query.set('tag', params.tag);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_URL}/api/posts?${query}`, {
    next: { revalidate: 60, tags: ['posts'] },
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    next: { revalidate: 60, tags: [`post-${slug}`] },
  });
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
  const res = await fetch(`${API_URL}/api/posts/slugs`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch slugs');
  return res.json();
}
