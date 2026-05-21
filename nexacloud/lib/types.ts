export interface Author {
  name: string;
  avatar: string | null;
  bio?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  readingTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category;
  tags: { tag: Tag }[];
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}
