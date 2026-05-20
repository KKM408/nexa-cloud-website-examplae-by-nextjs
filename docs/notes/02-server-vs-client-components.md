# Server Components vs Client Components

## 核心区别

```
服务器                              浏览器
────────────────────────────────────────────────
Server Component (默认)
  ↓ 渲染成 HTML
'use client' 组件                    hydration（激活交互）
  ↓ 也在服务器预渲染 HTML              ← JS bundle 发送到此
```

| 能力 | Server Component | Client Component |
|------|:---:|:---:|
| `useState` / `useEffect` | ❌ | ✅ |
| 事件处理 `onClick` | ❌ | ✅ |
| 浏览器 API (`window`, `localStorage`) | ❌ | ✅ |
| 直接读文件系统 / 数据库 | ✅ | ❌ |
| async/await 顶层 | ✅ | ❌ |
| 发送 JS 到浏览器 | ❌（零 JS） | ✅ |

## `'use client'` 的作用

- 加在文件**顶部第一行**
- 标记**客户端边界**：该文件 + 其所有子组件都进入客户端 bundle
- 服务器仍会预渲染 HTML（SSR），但 JS 也会发给浏览器（hydration）

```tsx
'use client';  // 必须是文件第一行

import { useState } from 'react';

export default function BillingToggle({ onToggle }: { onToggle: (v: boolean) => void }) {
  const [isYearly, setIsYearly] = useState(false);
  // useState 可用，因为有 'use client'
}
```

## 设计原则：客户端边界尽量小

```
PricingPage (Server Component)
├── PricingHeader (Server) ← 静态，无需 JS
├── BillingToggle (Client) ← 只有这一个交互岛
└── PricingCard[] (Server) ← 静态卡片，无需 JS
```

**规则：** 把 `'use client'` 推到组件树的**叶子节点**，Server Component 越多 → JS bundle 越小 → 性能越好。

## 本项目 Client Components 清单

| 组件 | 原因 |
|------|------|
| `BillingToggle.tsx` | `useState` 控制月/年切换 |
| `PricingFAQ.tsx` | `useState` 控制折叠展开 |
| `Navbar.tsx` | `useState` 控制移动端菜单 + `useEffect` 监听滚动 |

其余所有组件均为 Server Components（默认）。

## 数据获取模式

```tsx
// Server Component — 直接 async，无需 useEffect
export default async function BlogPage() {
  const posts = getAllPosts(); // 直接调用文件系统
  return <BlogList posts={posts} />;
}

// Client Component — 需要 useEffect（或 SWR/React Query）
'use client';
export default function Counter() {
  const [count, setCount] = useState(0);
  // 不能直接读文件系统
}
```
