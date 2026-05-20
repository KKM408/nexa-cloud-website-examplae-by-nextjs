# 渲染策略

## 四种策略对比

| 策略 | 何时生成 HTML | 数据新鲜度 | 适用场景 |
|------|-------------|-----------|---------|
| **SSG** 静态生成 | 构建时一次 | 部署时固定 | 内容不变的页面 |
| **ISR** 增量静态再生 | 构建时 + 定时刷新 | 可配置过期时间 | 内容偶尔更新 |
| **SSR** 服务端渲染 | 每次请求 | 实时 | 个性化/权限页面 |
| **CSR** 客户端渲染 | 浏览器运行时 | 实时 | 纯交互，无 SEO 需求 |

## 在 Next.js App Router 中配置

### SSG（默认行为）

不写任何配置 = SSG：

```tsx
// app/(marketing)/features/page.tsx
// 无 fetch，无 revalidate → 构建时静态生成
export default function FeaturesPage() {
  return <div>...</div>;
}
```

### ISR

导出 `revalidate` 常量（秒）：

```tsx
// app/(marketing)/blog/page.tsx
export const revalidate = 3600; // 1小时后过期，下次请求时后台重新生成

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogList posts={posts} />;
}
```

### SSR（动态渲染）

```tsx
export const dynamic = 'force-dynamic'; // 强制每次请求都 SSR
// 或使用 cookies() / headers() 会自动触发动态渲染
```

### Dynamic（API Route）

Route Handlers 默认动态：

```tsx
// app/api/contact/route.ts — 标记为 ƒ (Dynamic)
export async function POST(request: NextRequest) { ... }
```

## 本项目渲染策略

```
/ (首页)                → SSG   (构建时生成，内容固定)
/features               → SSG
/pricing                → SSG
/blog                   → ISR   revalidate=3600（文章更新不用重新部署）
/blog/[slug]            → SSG   generateStaticParams 预生成所有文章
/api/contact            → Dynamic（每次请求处理）
```

## generateStaticParams — SSG 动态路由

告诉 Next.js 构建时要预生成哪些动态路由：

```tsx
// app/(marketing)/blog/[slug]/page.tsx

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
  // 返回: [{ slug: 'nextjs-app-router-guide' }, { slug: 'performance-optimization' }, ...]
  // 构建时生成每篇文章的静态 HTML
}
```

构建输出：
```
● /blog/[slug]
│ ├ /blog/nextjs-app-router-guide      ← 静态 HTML
│ ├ /blog/performance-optimization     ← 静态 HTML
│ └ /blog/server-components-deep-dive  ← 静态 HTML
```

## fetch 缓存控制（有 API 数据时）

```tsx
// 默认缓存（SSG 行为）
const data = await fetch('https://api.example.com/posts');

// ISR：30秒后重新验证
const data = await fetch('https://api.example.com/posts', {
  next: { revalidate: 30 }
});

// 不缓存（SSR 行为）
const data = await fetch('https://api.example.com/posts', {
  cache: 'no-store'
});
```
