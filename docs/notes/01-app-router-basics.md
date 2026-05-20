# App Router 核心基础

## 文件路由系统

Next.js App Router 用**文件路径即路由**：

```
app/
├── layout.tsx          → 所有页面共享布局（不销毁重渲染）
├── page.tsx            → 路由 /
├── features/
│   └── page.tsx        → 路由 /features
├── blog/
│   ├── page.tsx        → 路由 /blog
│   └── [slug]/
│       └── page.tsx    → 路由 /blog/:slug（动态）
└── api/
    └── contact/
        └── route.ts    → API 路由 /api/contact
```

## 路由组 (Route Groups)

用括号命名的目录**不影响 URL**，只用于共享布局：

```
app/
├── (marketing)/        → URL 中不出现 "marketing"
│   ├── layout.tsx      → /、/features、/pricing、/blog 共享此布局
│   ├── page.tsx        → /
│   ├── features/page.tsx → /features
│   └── pricing/page.tsx  → /pricing
└── layout.tsx          → 根布局（所有页面）
```

**本项目用法：** `(marketing)` 组共享 Navbar + Footer，API 路由不进这个组所以没有导航栏。

## layout.tsx vs page.tsx

| 文件 | 作用 | 重渲染 |
|------|------|--------|
| `layout.tsx` | 持久包裹层，子路由切换时**不销毁** | 不重渲染 |
| `page.tsx` | 当前路由的实际内容 | 路由变化时渲染 |

## 特殊文件

| 文件 | 触发时机 |
|------|---------|
| `loading.tsx` | 页面数据加载中（自动 Suspense） |
| `error.tsx` | 页面抛出错误（Client Component） |
| `not-found.tsx` | 调用 `notFound()` 时 |

## Link 导航

```tsx
import Link from 'next/link';
<Link href="/pricing">定价</Link>
// 预加载 + 客户端导航，不刷新整页
```

## Next.js 16 破坏性变更

`params` 变成 **Promise**，必须 `await`：

```tsx
// ❌ Next.js 14/15 写法（16 中报错）
export default async function Page({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug); // params.slug 是 undefined！
}

// ✅ Next.js 16 正确写法
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
}
```
