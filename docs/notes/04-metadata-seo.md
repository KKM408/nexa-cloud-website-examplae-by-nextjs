# Metadata & SEO

## 静态 Metadata

在 `layout.tsx` 或 `page.tsx` 导出 `metadata` 对象：

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // title 模板：子页面用 %s，根布局用 default
  title: {
    template: '%s | NexaCloud',
    default: 'NexaCloud — Cloud Collaboration Platform',
  },
  description: '...',
  openGraph: {
    type: 'website',
    url: 'https://nexacloud.example.com',
    siteName: 'NexaCloud',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@nexacloud',
  },
  robots: { index: true, follow: true },
};
```

子页面只需设置 `title`，自动套用模板：

```tsx
// app/(marketing)/features/page.tsx
export const metadata: Metadata = {
  title: 'Features', // → "Features | NexaCloud"
};
```

## 动态 Metadata（generateMetadata）

用于动态路由，根据路由参数生成不同 meta：

```tsx
// app/(marketing)/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // Next.js 16: params 是 Promise
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,           // → "文章标题 | NexaCloud"
      description: post.excerpt,
    };
  } catch {
    return { title: 'Post not found' };
  }
}
```

## next/font — 字体优化

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',  // 注入为 CSS 变量
  display: 'swap',           // 先显示系统字体，加载完再换
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      {/* inter.variable 将 --font-inter 注入到 html 元素 */}
      <body>{children}</body>
    </html>
  );
}
```

在 CSS 中使用：

```css
/* globals.css */
:root {
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

**为什么用 next/font：**
- 字体文件在构建时下载到服务器，**零外部 HTTP 请求**
- 消除 FOUT（无样式文字闪烁）
- 自动注入 `font-display: swap`

## next/image — 图片优化

```tsx
import Image from 'next/image';

<Image
  src="/images/hero.png"
  alt="NexaCloud Dashboard"
  width={1200}
  height={800}
  priority           // 首屏图片加 priority，不懒加载
/>
```

- 自动生成 WebP/AVIF 格式
- 自动懒加载（viewport 外不加载）
- 防止 CLS（提前占位）
