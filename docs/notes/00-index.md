# NexaCloud 项目 · Next.js 学习笔记

> 通过构建 NexaCloud SaaS 企业官网，系统学习 Next.js 15/16 App Router 核心知识点。

## 目录

| 编号 | 主题 | 核心知识点 |
|------|------|-----------|
| [01](./01-app-router-basics.md) | App Router 基础 | 文件路由、路由组、layout vs page、Next.js 16 params 变更 |
| [02](./02-server-vs-client-components.md) | Server vs Client Components | `'use client'`、组件边界、数据获取模式 |
| [03](./03-rendering-strategies.md) | 渲染策略 | SSG、ISR、SSR、Dynamic、generateStaticParams |
| [04](./04-metadata-seo.md) | Metadata & SEO | generateMetadata、next/font、next/image |
| [05](./05-mdx-blog-system.md) | MDX 博客系统 | gray-matter、next-mdx-remote/rsc、动态路由 |
| [06](./06-route-handlers.md) | Route Handlers | API 路由、NextRequest/Response、环境变量 |
| [07](./07-css-modules-design-system.md) | CSS Modules & 设计系统 | CSS 变量、毛玻璃效果、渐变文字、响应式 |

## 项目概览

**技术栈：** Next.js 16 · TypeScript · CSS Modules · gray-matter · next-mdx-remote · Vercel

**页面渲染策略：**
```
/              → SSG  （构建时静态）
/features      → SSG
/pricing       → SSG
/blog          → ISR  revalidate=3600
/blog/[slug]   → SSG  generateStaticParams
/api/contact   → Dynamic（Route Handler）
```

**Client Components（交互岛）：**
- `Navbar` — 移动端菜单 + 滚动检测
- `BillingToggle` — 定价页月/年切换
- `PricingFAQ` — FAQ 折叠

其余全部为 Server Components。

## 关键"坑"记录

| 问题 | 原因 | 解决 |
|------|------|------|
| `params.slug` 为 undefined | Next.js 16 params 变成 Promise | `const { slug } = await params` |
| SSG 预渲染报 `useState` 错误 | 用了 `next-mdx-remote`（Client 版）而非 `/rsc` | 改用 `next-mdx-remote/rsc` |
| TSC 报找不到 `app/page.js` | 删除文件后 `.next/types/` 缓存未更新 | `npm run build` 重新生成 |
