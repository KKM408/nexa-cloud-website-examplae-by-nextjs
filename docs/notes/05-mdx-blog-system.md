# MDX 博客系统

## 数据流

```
content/blog/*.mdx
  → lib/mdx.ts (gray-matter 解析 frontmatter + content)
  → app/(marketing)/blog/page.tsx (ISR，展示文章列表)
  → app/(marketing)/blog/[slug]/page.tsx (SSG，展示文章详情)
  → MDXRenderer (next-mdx-remote/rsc 渲染 MDX)
```

## MDX 文件格式

```mdx
---
title: "Next.js App Router 完全指南"
date: "2026-05-19"
author: "NexaCloud Team"
tags: ["nextjs", "app-router"]
excerpt: "文章摘要..."
coverImage: "/images/blog/cover.jpg"
---

# 正文开始

MDX 支持在 Markdown 中写 **JSX 组件**：

<MyComponent prop="value" />
```

## gray-matter — 解析 frontmatter

```typescript
// lib/mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getPostBySlug(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  // data = frontmatter 对象
  // content = --- 之后的正文字符串
  return { slug, ...data, content } as BlogPost;
}
```

## next-mdx-remote/rsc — 渲染 MDX（App Router 写法）

**App Router 用 `/rsc` 导入（Server Component）：**

```tsx
// components/blog/MDXRenderer.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';

export default function MDXRenderer({ source }: { source: string }) {
  return (
    <div className={styles.prose}>
      <MDXRemote source={source} />  {/* 直接传原始 MDX 字符串 */}
    </div>
  );
}
```

**在页面中使用：**

```tsx
// app/(marketing)/blog/[slug]/page.tsx
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return <MDXRenderer source={post.content} />;
}
```

**注意：** 不需要 `serialize()`。`/rsc` 版本在服务器端直接编译 MDX。

### Pages Router 旧写法（对比，不推荐在 App Router 用）

```tsx
// ❌ Pages Router 写法，App Router 中会报 useState 错误
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote'; // 这个是 Client Component

const mdxSource = await serialize(post.content);
return <MDXRemote {...mdxSource} />;
```

## generateStaticParams + 博客

```tsx
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}
// 构建时为每篇 MDX 文章预生成静态页面
```

## getAllPosts — 按日期排序

```typescript
export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  return files
    .map(file => {
      const slug = file.replace('.mdx', '');
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8'));
      return { slug, ...data } as Omit<BlogPost, 'content'>;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
```
