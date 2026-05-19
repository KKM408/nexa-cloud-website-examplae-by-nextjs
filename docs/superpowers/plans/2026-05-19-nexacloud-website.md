# NexaCloud 企业官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Next.js 15 App Router + TypeScript + CSS Modules 构建 NexaCloud SaaS 企业官网，覆盖首页/功能页/定价页/博客系统，同步完成 6 阶段 Next.js 学习路线。

**Architecture:** App Router 路由组 `(marketing)` 统一营销布局；页面按内容类型选渲染策略（SSG/ISR）；博客用 MDX 文件驱动，`lib/mdx.ts` 统一读取；Client Components 仅用于交互岛。

**Tech Stack:** Next.js 15, TypeScript, CSS Modules, gray-matter, next-mdx-remote, Vercel

---

## 文件地图

| 文件 | 职责 |
|------|------|
| `types/index.ts` | 全局类型定义 |
| `app/globals.css` | CSS 变量 + Reset |
| `app/layout.tsx` | 根布局（Navbar + Footer） |
| `app/(marketing)/page.tsx` | 首页 |
| `app/(marketing)/features/page.tsx` | 功能页 |
| `app/(marketing)/pricing/page.tsx` | 定价页 |
| `app/(marketing)/blog/page.tsx` | 博客列表（ISR） |
| `app/(marketing)/blog/[slug]/page.tsx` | 博客详情（SSG） |
| `app/api/contact/route.ts` | 联系表单 Route Handler |
| `components/layout/Navbar.tsx` | 顶部导航 |
| `components/layout/Navbar.module.css` | Navbar 样式 |
| `components/layout/Footer.tsx` | 底部 |
| `components/layout/Footer.module.css` | Footer 样式 |
| `components/ui/Button.tsx` | 通用按钮 |
| `components/ui/Button.module.css` | 按钮样式 |
| `components/ui/GlassCard.tsx` | 毛玻璃卡片 |
| `components/ui/GlassCard.module.css` | 毛玻璃样式 |
| `components/ui/Badge.tsx` | 标签徽章 |
| `components/ui/Badge.module.css` | 徽章样式 |
| `components/home/Hero.tsx` | Hero 区块 |
| `components/home/Hero.module.css` | Hero 样式 |
| `components/home/FeatureGrid.tsx` | 功能网格 |
| `components/home/FeatureGrid.module.css` | 功能网格样式 |
| `components/home/StatsBar.tsx` | 统计数字条 |
| `components/home/StatsBar.module.css` | 统计条样式 |
| `components/home/Testimonials.tsx` | 客户评价 |
| `components/home/Testimonials.module.css` | 评价样式 |
| `components/home/PricingPreview.tsx` | 首页定价预览 |
| `components/home/PricingPreview.module.css` | 定价预览样式 |
| `components/home/CTASection.tsx` | 行动号召区 |
| `components/home/CTASection.module.css` | CTA 样式 |
| `components/features/FeatureDetail.tsx` | 功能详情块 |
| `components/features/FeatureDetail.module.css` | 功能详情样式 |
| `components/features/ComparisonTable.tsx` | 竞品对比表 |
| `components/features/ComparisonTable.module.css` | 对比表样式 |
| `components/pricing/PricingCard.tsx` | 定价卡片（Server） |
| `components/pricing/PricingCard.module.css` | 定价卡片样式 |
| `components/pricing/BillingToggle.tsx` | 月/年切换（Client） |
| `components/pricing/BillingToggle.module.css` | 切换样式 |
| `components/pricing/PricingFAQ.tsx` | FAQ 折叠（Client） |
| `components/pricing/PricingFAQ.module.css` | FAQ 样式 |
| `components/blog/BlogCard.tsx` | 博客卡片 |
| `components/blog/BlogCard.module.css` | 博客卡片样式 |
| `components/blog/MDXRenderer.tsx` | MDX 渲染器（Client） |
| `components/blog/MDXRenderer.module.css` | MDX 内容样式 |
| `lib/mdx.ts` | 读取/解析 MDX 文件 |
| `content/blog/*.mdx` | 博客文章（3 篇） |

---

## 阶段 01 · 环境搭建 & App Router 核心

### Task 1: 初始化 Next.js 项目

**Files:**
- Create: `nextjs-study/` (项目根目录，在当前工作区 **同级** 新建)

> **注意：** 在 `D:\Desktop\_My\` 下执行，不是在 `nextjs-study` 内部执行。

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd "D:/Desktop/_My"
npx create-next-app@latest nexacloud --typescript --no-tailwind --app --no-src-dir --no-turbopack --import-alias "@/*"
cd nexacloud
```

- [ ] **Step 2: 安装额外依赖**

```bash
npm install gray-matter next-mdx-remote
npm install --save-dev @types/node
```

- [ ] **Step 3: 验证项目启动**

```bash
npm run dev
```

访问 `http://localhost:3000`，看到 Next.js 默认页面即成功。Ctrl+C 停止。

- [ ] **Step 4: 初始化 git**

```bash
git init
echo ".next\nnode_modules\n.env.local\n.superpowers" > .gitignore
git add .
git commit -m "feat: initialize Next.js 15 project with TypeScript"
```

---

### Task 2: 全局类型定义

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: 写类型文件**

```typescript
// types/index.ts
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  content: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface Stat {
  value: string;
  label: string;
}
```

- [ ] **Step 2: 类型检查**

```bash
npx tsc --noEmit
```

Expected: 无报错输出。

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: add global TypeScript type definitions"
```

---

### Task 3: 全局 CSS 变量 & Reset

**Files:**
- Modify: `app/globals.css` (替换全部内容)

- [ ] **Step 1: 写全局样式**

```css
/* app/globals.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-bg: #0f0f1a;
  --color-bg-secondary: #1a1a2e;
  --color-surface: rgba(255, 255, 255, 0.05);
  --color-surface-hover: rgba(255, 255, 255, 0.08);
  --color-border: rgba(255, 255, 255, 0.1);
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-text-faint: #4b5563;
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-hero: linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f0f1a 100%);
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Courier New', Courier, monospace;
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-glow: 0 0 40px rgba(102, 126, 234, 0.15);
  --nav-height: 72px;
  --container-max: 1200px;
  --container-padding: 0 24px;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--container-padding);
}

.section {
  padding: 96px 0;
}

.section-title {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto 64px;
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 2: 验证 TypeScript 无错**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add global CSS variables and base reset"
```

---

### Task 4: Navbar 组件

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Navbar.module.css`

- [ ] **Step 1: 写 Navbar 样式**

```css
/* components/layout/Navbar.module.css */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-height);
  background: rgba(15, 15, 26, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--container-padding);
}

.logo {
  font-size: 22px;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.link {
  font-size: 14px;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.link:hover {
  color: var(--color-text);
}

.cta {
  background: var(--gradient-primary);
  color: #fff;
  padding: 10px 22px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.cta:hover {
  opacity: 0.9;
}

.mobileMenu {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobileMenu span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  margin: 5px 0;
  border-radius: 2px;
  transition: transform 0.2s;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  .mobileMenu {
    display: block;
  }
}
```

- [ ] **Step 2: 写 Navbar 组件**

```typescript
// components/layout/Navbar.tsx
import Link from 'next/link';
import styles from './Navbar.module.css';

const links = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          NexaCloud
        </Link>
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
          <Link href="#" className={styles.cta}>
            Get Started
          </Link>
        </nav>
        <button className={styles.mobileMenu} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: 类型检查**

```bash
npx tsc --noEmit
```

Expected: 无报错。

---

### Task 5: Footer 组件

**Files:**
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/Footer.module.css`

- [ ] **Step 1: 写 Footer 样式**

```css
/* components/layout/Footer.module.css */
.footer {
  border-top: 1px solid var(--color-border);
  padding: 64px 0 32px;
  background: var(--color-bg);
}

.inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--container-padding);
}

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.brand {
  font-size: 20px;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.brandDesc {
  font-size: 14px;
  color: var(--color-text-muted);
  max-width: 240px;
  line-height: 1.7;
}

.colTitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.colLinks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.colLinks a {
  font-size: 14px;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.colLinks a:hover {
  color: var(--color-text);
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text-faint);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}
```

- [ ] **Step 2: 写 Footer 组件**

```typescript
// components/layout/Footer.tsx
import Link from 'next/link';
import styles from './Footer.module.css';

const columns = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#', label: 'About' },
      { href: '#', label: 'Careers' },
      { href: '#', label: 'Press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#', label: 'Privacy' },
      { href: '#', label: 'Terms' },
      { href: '#', label: 'Security' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>NexaCloud</div>
            <p className={styles.brandDesc}>
              The cloud collaboration platform built for modern enterprises. Scale without limits.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className={styles.colTitle}>{col.title}</div>
              <ul className={styles.colLinks}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>© 2026 NexaCloud, Inc. All rights reserved.</span>
          <span>Built with Next.js 15</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: 类型检查**

```bash
npx tsc --noEmit
```

---

### Task 6: 根布局 + 路由骨架

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/(marketing)/layout.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/features/page.tsx`
- Create: `app/(marketing)/pricing/page.tsx`
- Create: `app/(marketing)/blog/page.tsx`
- Create: `app/(marketing)/blog/[slug]/page.tsx`

- [ ] **Step 1: 修改根布局**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | NexaCloud',
    default: 'NexaCloud — Cloud Collaboration Platform',
  },
  description: 'The cloud collaboration platform built for modern enterprises. Scale without limits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: 创建营销布局（含 Navbar + Footer）**

```typescript
// app/(marketing)/layout.tsx
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)' }}>{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: 创建页面骨架**

```typescript
// app/(marketing)/page.tsx
export default function HomePage() {
  return <div>首页 — 建设中</div>;
}
```

```typescript
// app/(marketing)/features/page.tsx
export default function FeaturesPage() {
  return <div>功能页 — 建设中</div>;
}
```

```typescript
// app/(marketing)/pricing/page.tsx
export default function PricingPage() {
  return <div>定价页 — 建设中</div>;
}
```

```typescript
// app/(marketing)/blog/page.tsx
export default function BlogPage() {
  return <div>博客列表 — 建设中</div>;
}
```

```typescript
// app/(marketing)/blog/[slug]/page.tsx
export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  return <div>博客详情: {params.slug} — 建设中</div>;
}
```

- [ ] **Step 4: 验证路由可访问**

```bash
npm run dev
```

访问以下路由，每个都返回对应文字：
- `http://localhost:3000/` → "首页 — 建设中"（有 Navbar + Footer）
- `http://localhost:3000/features` → "功能页 — 建设中"
- `http://localhost:3000/pricing` → "定价页 — 建设中"
- `http://localhost:3000/blog` → "博客列表 — 建设中"
- `http://localhost:3000/blog/test` → "博客详情: test — 建设中"

Ctrl+C 停止。

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: set up App Router layout with Navbar, Footer, and route skeletons"
```

---

## 阶段 02 · Server Components & Client Components

### Task 7: UI 基础组件

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Button.module.css`
- Create: `components/ui/GlassCard.tsx`
- Create: `components/ui/GlassCard.module.css`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Badge.module.css`

- [ ] **Step 1: Button 样式**

```css
/* components/ui/Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.primary {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
}

.secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
}

.secondary:hover {
  background: var(--color-surface-hover);
  border-color: rgba(255, 255, 255, 0.2);
}

.large {
  padding: 16px 36px;
  font-size: 17px;
}
```

- [ ] **Step 2: Button 组件**

```typescript
// components/ui/Button.tsx
import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({
  href,
  variant = 'primary',
  size = 'default',
  children,
  onClick,
}: ButtonProps) {
  const className = [
    styles.button,
    styles[variant],
    size === 'large' ? styles.large : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

- [ ] **Step 3: GlassCard 样式 + 组件**

```css
/* components/ui/GlassCard.module.css */
.card {
  background: var(--color-surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 32px;
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}
```

```typescript
// components/ui/GlassCard.tsx
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Badge 样式 + 组件**

```css
/* components/ui/Badge.module.css */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.15);
  color: #a5b4fc;
  border: 1px solid rgba(102, 126, 234, 0.25);
}
```

```typescript
// components/ui/Badge.tsx
import styles from './Badge.module.css';

export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}
```

- [ ] **Step 5: 类型检查**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: add Button, GlassCard, Badge UI components"
```

---

### Task 8: Hero 组件

**Files:**
- Create: `components/home/Hero.tsx`
- Create: `components/home/Hero.module.css`

- [ ] **Step 1: Hero 样式**

```css
/* components/home/Hero.module.css */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--gradient-hero);
}

.hero::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%);
  bottom: -50px;
  left: 10%;
  pointer-events: none;
}

.inner {
  position: relative;
  z-index: 1;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
}

.badge {
  display: inline-flex;
  margin-bottom: 24px;
}

.title {
  font-size: clamp(40px, 7vw, 80px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}

.subtitle {
  font-size: clamp(16px, 2vw, 20px);
  color: var(--color-text-muted);
  max-width: 560px;
  margin: 0 auto 40px;
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 64px;
}

.mockup {
  max-width: 900px;
  margin: 0 auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5), var(--shadow-glow);
}

.mockupBar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot:nth-child(1) { background: #ff5f57; }
.dot:nth-child(2) { background: #febc2e; }
.dot:nth-child(3) { background: #28c840; }

.mockupContent {
  height: 360px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: calc(var(--radius-lg) - 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 14px;
  font-family: var(--font-mono);
}
```

- [ ] **Step 2: Hero 组件（Server Component）**

```typescript
// components/home/Hero.tsx
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.badge}>
          <Badge>✨ Now with AI-powered collaboration</Badge>
        </div>
        <h1 className={styles.title}>
          Scale without{' '}
          <span className="gradient-text">limits.</span>
        </h1>
        <p className={styles.subtitle}>
          NexaCloud is the enterprise cloud platform that helps teams ship faster, collaborate smarter, and scale confidently.
        </p>
        <div className={styles.actions}>
          <Button href="#" size="large">
            Start for free →
          </Button>
          <Button href="#" variant="secondary" size="large">
            Watch demo
          </Button>
        </div>
        <div className={styles.mockup}>
          <div className={styles.mockupBar}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
          <div className={styles.mockupContent}>
            // NexaCloud Dashboard — coming soon
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 类型检查**

```bash
npx tsc --noEmit
```

---

### Task 9: FeatureGrid + StatsBar 组件

**Files:**
- Create: `components/home/FeatureGrid.tsx`
- Create: `components/home/FeatureGrid.module.css`
- Create: `components/home/StatsBar.tsx`
- Create: `components/home/StatsBar.module.css`

- [ ] **Step 1: FeatureGrid 样式**

```css
/* components/home/FeatureGrid.module.css */
.section {
  padding: 96px 0;
  background: var(--color-bg-secondary);
}

.inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--container-padding);
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 64px;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 32px;
  text-align: left;
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-4px);
}

.icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: block;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.desc {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: FeatureGrid 组件（Server Component）**

```typescript
// components/home/FeatureGrid.tsx
import type { Feature } from '@/types';
import styles from './FeatureGrid.module.css';

const features: Feature[] = [
  { icon: '⚡', title: 'Lightning Fast', description: 'Deploy in seconds with our globally distributed edge network. 99.9% uptime guaranteed.' },
  { icon: '🔒', title: 'Enterprise Security', description: 'SOC 2 Type II certified. End-to-end encryption, SSO, and granular access controls.' },
  { icon: '🔗', title: '500+ Integrations', description: 'Connect your existing tools. Slack, GitHub, Jira, Salesforce and hundreds more.' },
  { icon: '📊', title: 'Real-time Analytics', description: 'Actionable insights into team performance, resource usage, and business metrics.' },
  { icon: '🤖', title: 'AI-Powered', description: 'Intelligent automation, smart suggestions, and AI assistants built into every workflow.' },
  { icon: '🌍', title: 'Global Scale', description: 'Multi-region deployment with automatic failover. Your data, wherever your team is.' },
];

export default function FeatureGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className="section-title">
          Everything your team <span className="gradient-text">needs</span>
        </h2>
        <p className="section-subtitle">
          Purpose-built tools that enterprise teams rely on to ship faster and scale confidently.
        </p>
        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.title} className={styles.card}>
              <span className={styles.icon}>{f.icon}</span>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.desc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: StatsBar 样式**

```css
/* components/home/StatsBar.module.css */
.section {
  padding: 64px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--container-padding);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.stat {
  text-align: center;
}

.value {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .inner {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 4: StatsBar 组件（Server Component）**

```typescript
// components/home/StatsBar.tsx
import type { Stat } from '@/types';
import styles from './StatsBar.module.css';

const stats: Stat[] = [
  { value: '50K+', label: 'Teams worldwide' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '500+', label: 'Integrations' },
  { value: '4.9★', label: 'Average rating' },
];

export default function StatsBar() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: 类型检查**

```bash
npx tsc --noEmit
```

---

### Task 10: Testimonials + CTASection 组件

**Files:**
- Create: `components/home/Testimonials.tsx`
- Create: `components/home/Testimonials.module.css`
- Create: `components/home/CTASection.tsx`
- Create: `components/home/CTASection.module.css`

- [ ] **Step 1: Testimonials 样式**

```css
/* components/home/Testimonials.module.css */
.section {
  padding: 96px 0;
  background: var(--color-bg-secondary);
}

.inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--container-padding);
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 64px;
}

.card {
  background: var(--color-surface);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 32px;
  text-align: left;
}

.quote {
  font-size: 15px;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 24px;
  font-style: italic;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.name {
  font-size: 14px;
  font-weight: 700;
}

.role {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Testimonials 组件（Server Component）**

```typescript
// components/home/Testimonials.tsx
import type { Testimonial } from '@/types';
import styles from './Testimonials.module.css';

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'Acme Corp',
    content: 'NexaCloud transformed how our 200-person engineering team collaborates. Deployment time went from hours to minutes.',
    avatar: '👩‍💻',
  },
  {
    name: 'Marcus Johnson',
    role: 'VP Engineering',
    company: 'TechFlow',
    content: 'The AI features alone saved us 15 hours per week in code reviews and documentation. This is the future.',
    avatar: '👨‍🔬',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Engineering Lead',
    company: 'Nexus Labs',
    content: 'Migration took 2 days, not 2 months like we feared. The support team was exceptional throughout.',
    avatar: '👩‍🚀',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className="section-title">
          Loved by <span className="gradient-text">engineering teams</span>
        </h2>
        <p className="section-subtitle">
          Join 50,000+ teams that trust NexaCloud to power their most critical workflows.
        </p>
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.name} className={styles.card}>
              <p className={styles.quote}>"{t.content}"</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.avatar}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: CTASection 样式**

```css
/* components/home/CTASection.module.css */
.section {
  padding: 120px 0;
  background: var(--gradient-primary);
  position: relative;
  overflow: hidden;
}

.section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E");
}

.inner {
  position: relative;
  z-index: 1;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--container-padding);
  text-align: center;
}

.title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  color: #fff;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btnPrimary {
  background: #fff;
  color: #667eea;
  padding: 16px 36px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 700;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.btnPrimary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.btnSecondary {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px 36px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s;
  display: inline-block;
}

.btnSecondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

.note {
  margin-top: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}
```

- [ ] **Step 4: CTASection 组件（Server Component）**

```typescript
// components/home/CTASection.tsx
import Link from 'next/link';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Ready to scale without limits?</h2>
        <p className={styles.subtitle}>
          Join 50,000+ teams. Free forever, upgrade when you need.
        </p>
        <div className={styles.actions}>
          <Link href="#" className={styles.btnPrimary}>
            Start for free →
          </Link>
          <Link href="#" className={styles.btnSecondary}>
            Talk to sales
          </Link>
        </div>
        <p className={styles.note}>No credit card required · 14-day Pro trial included</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: 类型检查**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add components/home/
git commit -m "feat: add Hero, FeatureGrid, StatsBar, Testimonials, CTASection components"
```

---

### Task 11: 组装首页

**Files:**
- Modify: `app/(marketing)/page.tsx`

- [ ] **Step 1: 组装首页（纯 Server Component）**

```typescript
// app/(marketing)/page.tsx
import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import FeatureGrid from '@/components/home/FeatureGrid';
import StatsBar from '@/components/home/StatsBar';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'NexaCloud — Cloud Collaboration Platform',
  description: 'The cloud collaboration platform built for modern enterprises. Scale without limits.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <Testimonials />
      <CTASection />
    </>
  );
}
```

- [ ] **Step 2: 开发服务器验证**

```bash
npm run dev
```

访问 `http://localhost:3000`，确认：
- Navbar 固定顶部，毛玻璃效果
- Hero 区块：大标题、按钮、产品 mockup
- 统计数字条（50K+、99.9% 等）
- 6 个功能卡片
- 3 条客户评价
- 渐变 CTA 区块
- Footer

Ctrl+C 停止。

- [ ] **Step 3: Commit**

```bash
git add app/
git commit -m "feat: assemble home page with all sections (phase 02 complete)"
```

---

## 阶段 03 · 数据获取 & 渲染策略

### Task 12: 功能页

**Files:**
- Create: `components/features/FeatureDetail.tsx`
- Create: `components/features/FeatureDetail.module.css`
- Create: `components/features/ComparisonTable.tsx`
- Create: `components/features/ComparisonTable.module.css`
- Modify: `app/(marketing)/features/page.tsx`

- [ ] **Step 1: FeatureDetail 样式**

```css
/* components/features/FeatureDetail.module.css */
.block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding: 80px 0;
  border-bottom: 1px solid var(--color-border);
}

.block:last-of-type {
  border-bottom: none;
}

.block.reverse {
  direction: rtl;
}

.block.reverse > * {
  direction: ltr;
}

.badge {
  display: inline-flex;
  margin-bottom: 16px;
}

.title {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.desc {
  font-size: 16px;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 24px;
}

.points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.points li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.points li::before {
  content: '✓';
  color: #667eea;
  font-weight: 700;
  flex-shrink: 0;
}

.visual {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
}

@media (max-width: 768px) {
  .block, .block.reverse {
    grid-template-columns: 1fr;
    direction: ltr;
  }
}
```

- [ ] **Step 2: FeatureDetail 组件**

```typescript
// components/features/FeatureDetail.tsx
import Badge from '@/components/ui/Badge';
import styles from './FeatureDetail.module.css';

interface FeatureDetailProps {
  badge: string;
  title: string;
  description: string;
  points: string[];
  icon: string;
  reverse?: boolean;
}

export default function FeatureDetail({
  badge,
  title,
  description,
  points,
  icon,
  reverse = false,
}: FeatureDetailProps) {
  return (
    <div className={[styles.block, reverse ? styles.reverse : ''].filter(Boolean).join(' ')}>
      <div>
        <div className={styles.badge}>
          <Badge>{badge}</Badge>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
        <ul className={styles.points}>
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <div className={styles.visual}>{icon}</div>
    </div>
  );
}
```

- [ ] **Step 3: ComparisonTable 样式**

```css
/* components/features/ComparisonTable.module.css */
.wrapper {
  margin-top: 80px;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  padding: 16px 24px;
  text-align: left;
  font-weight: 700;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.table td {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.table td:first-child {
  color: var(--color-text);
  font-weight: 500;
}

.yes { color: #667eea !important; font-weight: 700; }
.no { color: var(--color-text-faint) !important; }

.highlight {
  background: rgba(102, 126, 234, 0.05);
}

.planName {
  color: var(--color-text) !important;
  font-weight: 700 !important;
}
```

- [ ] **Step 4: ComparisonTable 组件**

```typescript
// components/features/ComparisonTable.tsx
import styles from './ComparisonTable.module.css';

const rows = [
  { feature: 'Team members', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Projects', free: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Storage', free: '5 GB', pro: '100 GB', enterprise: 'Custom' },
  { feature: 'AI Assistant', free: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'SSO / SAML', free: '✗', pro: '✗', enterprise: '✓' },
  { feature: 'Audit Logs', free: '✗', pro: '30 days', enterprise: 'Unlimited' },
  { feature: 'SLA', free: '✗', pro: '99.9%', enterprise: '99.99%' },
  { feature: 'Support', free: 'Community', pro: 'Email', enterprise: 'Dedicated CSM' },
];

export default function ComparisonTable() {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Feature</th>
            <th className={styles.planName}>Free</th>
            <th className={styles.planName}>Pro</th>
            <th className={styles.planName}>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature}>
              <td>{row.feature}</td>
              <td className={row.free === '✗' ? styles.no : row.free === '✓' ? styles.yes : ''}>
                {row.free}
              </td>
              <td className={[styles.highlight, row.pro === '✗' ? styles.no : row.pro === '✓' ? styles.yes : ''].join(' ')}>
                {row.pro}
              </td>
              <td className={row.enterprise === '✗' ? styles.no : row.enterprise === '✓' ? styles.yes : ''}>
                {row.enterprise}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 5: 组装功能页（SSG）**

```typescript
// app/(marketing)/features/page.tsx
import type { Metadata } from 'next';
import FeatureDetail from '@/components/features/FeatureDetail';
import ComparisonTable from '@/components/features/ComparisonTable';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore NexaCloud features built for enterprise teams.',
};

const featureBlocks = [
  {
    badge: '⚡ Performance',
    title: 'Deploy at the speed of thought',
    description: 'Our globally distributed edge network means your team works faster no matter where they are. Sub-100ms response times, worldwide.',
    points: ['99.9% uptime SLA with automatic failover', 'CDN-first architecture across 50+ regions', 'Zero-downtime deployments', 'Real-time collaboration without conflicts'],
    icon: '⚡',
    reverse: false,
  },
  {
    badge: '🔒 Security',
    title: 'Enterprise-grade security built in',
    description: 'SOC 2 Type II certified from day one. Security is not an afterthought — it\'s the foundation.',
    points: ['End-to-end encryption at rest and in transit', 'SSO, SAML, and MFA support', 'Granular role-based access control', 'Automated security scanning on every commit'],
    icon: '🔒',
    reverse: true,
  },
  {
    badge: '🤖 AI',
    title: 'AI that actually understands your codebase',
    description: 'NexaCloud AI learns your patterns, suggests improvements, and automates the boring parts so your team focuses on what matters.',
    points: ['Context-aware code review suggestions', 'Automated documentation generation', 'Intelligent test generation', 'Anomaly detection and proactive alerts'],
    icon: '🤖',
    reverse: false,
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="section-title">
          Built for teams that <span className="gradient-text">ship</span>
        </h1>
        <p className="section-subtitle">
          Every feature is designed to remove friction, not add it.
        </p>
      </div>
      {featureBlocks.map((block) => (
        <FeatureDetail key={block.badge} {...block} />
      ))}
      <h2 className="section-title" style={{ textAlign: 'center', marginTop: '80px' }}>
        Compare <span className="gradient-text">plans</span>
      </h2>
      <ComparisonTable />
    </div>
  );
}
```

- [ ] **Step 6: 验证**

```bash
npm run dev
```

访问 `http://localhost:3000/features`，确认 3 个功能区块 + 对比表渲染正常。

- [ ] **Step 7: Commit**

```bash
git add components/features/ app/(marketing)/features/
git commit -m "feat: add features page with FeatureDetail and ComparisonTable"
```

---

### Task 13: 定价页（含 Client Component 切换）

**Files:**
- Create: `components/pricing/PricingCard.tsx`
- Create: `components/pricing/PricingCard.module.css`
- Create: `components/pricing/BillingToggle.tsx`
- Create: `components/pricing/BillingToggle.module.css`
- Create: `components/pricing/PricingFAQ.tsx`
- Create: `components/pricing/PricingFAQ.module.css`
- Modify: `app/(marketing)/pricing/page.tsx`

- [ ] **Step 1: PricingCard 样式**

```css
/* components/pricing/PricingCard.module.css */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, border-color 0.2s;
}

.highlighted {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.08);
  position: relative;
}

.highlightedBadge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gradient-primary);
  color: #fff;
  padding: 4px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.desc {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 32px;
}

.price {
  margin-bottom: 32px;
}

.amount {
  font-size: 52px;
  font-weight: 900;
  line-height: 1;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.period {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-left: 4px;
}

.custom {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-text);
}

.features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  margin-bottom: 32px;
}

.features li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.features li::before {
  content: '✓';
  color: var(--color-primary);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

.cta {
  display: block;
  text-align: center;
  padding: 14px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
  margin-top: auto;
}

.ctaPrimary {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.ctaPrimary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.ctaSecondary {
  background: var(--color-surface-hover);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.ctaSecondary:hover {
  border-color: rgba(255, 255, 255, 0.2);
}
```

- [ ] **Step 2: PricingCard 组件（Server Component，接受 isYearly prop）**

```typescript
// components/pricing/PricingCard.tsx
import Link from 'next/link';
import type { PricingPlan } from '@/types';
import styles from './PricingCard.module.css';

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
}

export default function PricingCard({ plan, isYearly }: PricingCardProps) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div className={[styles.card, plan.highlighted ? styles.highlighted : ''].filter(Boolean).join(' ')}>
      {plan.highlighted && <div className={styles.highlightedBadge}>Most Popular</div>}
      <div className={styles.name}>{plan.name}</div>
      <div className={styles.desc}>{plan.description}</div>
      <div className={styles.price}>
        {price === null ? (
          <span className={styles.custom}>Custom</span>
        ) : (
          <>
            <span className={styles.amount}>${price}</span>
            <span className={styles.period}>/{isYearly ? 'yr' : 'mo'}</span>
          </>
        )}
      </div>
      <ul className={styles.features}>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <Link
        href="#"
        className={[styles.cta, plan.highlighted ? styles.ctaPrimary : styles.ctaSecondary].join(' ')}
      >
        {plan.cta}
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: BillingToggle（Client Component）**

```css
/* components/pricing/BillingToggle.module.css */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 64px;
}

.label {
  font-size: 15px;
  color: var(--color-text-muted);
  cursor: pointer;
}

.labelActive {
  color: var(--color-text);
  font-weight: 600;
}

.track {
  width: 52px;
  height: 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 100px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.trackActive {
  background: var(--gradient-primary);
  border-color: transparent;
}

.thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.thumbActive {
  transform: translateX(24px);
}

.saveBadge {
  background: rgba(102, 126, 234, 0.15);
  color: #a5b4fc;
  border: 1px solid rgba(102, 126, 234, 0.25);
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}
```

```typescript
// components/pricing/BillingToggle.tsx
'use client';

import { useState } from 'react';
import styles from './BillingToggle.module.css';

interface BillingToggleProps {
  onToggle: (isYearly: boolean) => void;
}

export default function BillingToggle({ onToggle }: BillingToggleProps) {
  const [isYearly, setIsYearly] = useState(false);

  const toggle = () => {
    const next = !isYearly;
    setIsYearly(next);
    onToggle(next);
  };

  return (
    <div className={styles.wrapper}>
      <span className={[styles.label, !isYearly ? styles.labelActive : ''].filter(Boolean).join(' ')}>
        Monthly
      </span>
      <button
        className={[styles.track, isYearly ? styles.trackActive : ''].filter(Boolean).join(' ')}
        onClick={toggle}
        aria-label="Toggle billing period"
      >
        <div className={[styles.thumb, isYearly ? styles.thumbActive : ''].filter(Boolean).join(' ')} />
      </button>
      <span className={[styles.label, isYearly ? styles.labelActive : ''].filter(Boolean).join(' ')}>
        Yearly
      </span>
      {isYearly && <span className={styles.saveBadge}>Save 20%</span>}
    </div>
  );
}
```

- [ ] **Step 4: PricingFAQ（Client Component，折叠）**

```css
/* components/pricing/PricingFAQ.module.css */
.section {
  margin-top: 96px;
}

.title {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800;
  text-align: center;
  margin-bottom: 48px;
}

.list {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  text-align: left;
  gap: 16px;
}

.question:hover {
  background: var(--color-surface);
}

.chevron {
  font-size: 18px;
  flex-shrink: 0;
  transition: transform 0.2s;
  color: var(--color-text-muted);
}

.chevronOpen {
  transform: rotate(180deg);
}

.answer {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.8;
  padding: 0 24px 20px;
}
```

```typescript
// components/pricing/PricingFAQ.tsx
'use client';

import { useState } from 'react';
import styles from './PricingFAQ.module.css';

const faqs = [
  {
    q: 'Can I change my plan later?',
    a: 'Yes. You can upgrade or downgrade at any time. Changes take effect immediately, and we pro-rate billing automatically.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express) and wire transfer for Enterprise plans.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Every account starts with a 14-day Pro trial, no credit card required. After the trial, you\'ll be moved to the Free plan unless you upgrade.',
  },
  {
    q: 'What is your refund policy?',
    a: 'If you\'re not satisfied within the first 30 days, contact us for a full refund. No questions asked.',
  },
  {
    q: 'How does Enterprise pricing work?',
    a: 'Enterprise pricing is custom-built around your team size, usage, and requirements. Contact our sales team for a tailored quote.',
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>
        Frequently asked <span className="gradient-text">questions</span>
      </h2>
      <div className={styles.list}>
        {faqs.map((faq, i) => (
          <div key={faq.q} className={styles.item}>
            <button
              className={styles.question}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
              <span className={[styles.chevron, open === i ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
                ▾
              </span>
            </button>
            {open === i && <p className={styles.answer}>{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 组装定价页（含 Server/Client 组件协作）**

```typescript
// app/(marketing)/pricing/page.tsx
'use client';

import { useState } from 'react';
import type { PricingPlan } from '@/types';
import PricingCard from '@/components/pricing/PricingCard';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingFAQ from '@/components/pricing/PricingFAQ';

const plans: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for small teams getting started.',
    features: ['Up to 5 team members', '3 projects', '5 GB storage', 'Community support', 'Basic analytics'],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 278,
    description: 'Everything you need for growing teams.',
    features: ['Unlimited team members', 'Unlimited projects', '100 GB storage', 'AI Assistant', 'Email support', '99.9% SLA', '30-day audit logs'],
    cta: 'Start Pro trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'Custom solutions for large organizations.',
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated CSM', '99.99% SLA', 'Custom storage', 'Unlimited audit logs', 'On-premise option'],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="section-title">
          Simple, <span className="gradient-text">transparent</span> pricing
        </h1>
        <p className="section-subtitle">
          Start free. Upgrade when you need. Cancel anytime.
        </p>
      </div>
      <BillingToggle onToggle={setIsYearly} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' }}>
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
        ))}
      </div>
      <PricingFAQ />
    </div>
  );
}
```

- [ ] **Step 6: 验证**

```bash
npm run dev
```

访问 `http://localhost:3000/pricing`，确认：
- 3 张定价卡片，Pro 有"Most Popular"标签
- 月/年切换 toggle 工作正常，价格实时变化
- FAQ 折叠展开正常

- [ ] **Step 7: Commit**

```bash
git add components/pricing/ app/(marketing)/pricing/
git commit -m "feat: add pricing page with BillingToggle (Client Component) and FAQ accordion"
```

---

## 阶段 04 · 动态路由 & 博客系统

### Task 14: lib/mdx.ts + 类型

**Files:**
- Create: `lib/mdx.ts`

- [ ] **Step 1: 写 MDX 工具函数**

```typescript
// lib/mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from '@/types';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  return files
    .map((filename) => {
      const slug = filename.replace('.mdx', '');
      const filePath = path.join(BLOG_DIR, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        author: data.author as string,
        tags: (data.tags as string[]) ?? [],
        excerpt: data.excerpt as string,
        coverImage: data.coverImage as string,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    author: data.author as string,
    tags: (data.tags as string[]) ?? [],
    excerpt: data.excerpt as string,
    coverImage: data.coverImage as string,
    content,
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}
```

- [ ] **Step 2: 类型检查**

```bash
npx tsc --noEmit
```

Expected: 无报错。

---

### Task 15: MDX 博客文章（3 篇）

**Files:**
- Create: `content/blog/nextjs-app-router-guide.mdx`
- Create: `content/blog/server-components-deep-dive.mdx`
- Create: `content/blog/performance-optimization.mdx`

- [ ] **Step 1: 创建 content/blog 目录**

```bash
mkdir -p content/blog
```

- [ ] **Step 2: 写第 1 篇文章**

```mdx
---
title: "Next.js App Router 完全指南"
date: "2026-05-15"
author: "NexaCloud Team"
tags: ["nextjs", "app-router", "tutorial"]
excerpt: "从 Pages Router 迁移到 App Router？本文覆盖所有核心概念：layouts、loading states、error boundaries，以及 Server Components 的工作原理。"
coverImage: "/images/blog/app-router.jpg"
---

# Next.js App Router 完全指南

Next.js 13 引入的 App Router 彻底改变了构建 React 应用的方式。本文带你系统掌握所有核心概念。

## 什么是 App Router

App Router 基于 React Server Components (RSC) 构建，允许组件在服务器端渲染，减少发送到客户端的 JavaScript 体积。

## 文件系统路由

在 `app/` 目录中，每个 `page.tsx` 文件对应一个路由：

```
app/
├── page.tsx          → /
├── about/page.tsx    → /about
└── blog/
    ├── page.tsx      → /blog
    └── [slug]/
        └── page.tsx  → /blog/:slug
```

## 嵌套布局

`layout.tsx` 在路由之间共享 UI，且在导航时不重新渲染：

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

## Loading & Error 状态

`loading.tsx` 在页面加载时自动显示，`error.tsx` 捕获运行时错误：

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>Loading posts...</div>;
}
```

## 结论

App Router 让构建复杂应用变得更直观。掌握 layouts、Server Components 和数据获取模式，你就掌握了现代 Next.js 开发的核心。
```

- [ ] **Step 3: 写第 2 篇文章**

```mdx
---
title: "Server Components 深度解析"
date: "2026-05-10"
author: "NexaCloud Team"
tags: ["nextjs", "server-components", "react"]
excerpt: "Server Components 不是 SSR 的升级版——它是全新的范式。理解 RSC 与 'use client' 的边界划分，写出性能最优的 Next.js 应用。"
coverImage: "/images/blog/server-components.jpg"
---

# Server Components 深度解析

React Server Components (RSC) 是过去几年 React 生态中最重要的架构变化。

## Server vs Client Components

**Server Components（默认）：**
- 在服务器执行，不发送 JS 到客户端
- 可以直接访问数据库、文件系统
- 不能使用 `useState`、`useEffect`、事件处理器

**Client Components（`'use client'`）：**
- 在浏览器执行
- 支持所有 React hooks
- 支持用户交互

## 边界划分原则

把 `'use client'` 推到组件树的叶节点：

```tsx
// 大部分页面是 Server Component
export default function ProductPage() {
  const product = await fetchProduct(); // 直接 fetch，无需 useEffect
  return (
    <div>
      <ProductInfo product={product} />   {/* Server Component */}
      <AddToCartButton productId={product.id} /> {/* Client Component */}
    </div>
  );
}
```

## 数据获取

Server Components 可以直接 `async/await`：

```tsx
async function BlogList() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return <ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>;
}
```

## 结论

Server Components 的核心价值：把数据获取和渲染放在服务器，仅把交互岛（Client Components）发送给浏览器。这是性能优化的根本。
```

- [ ] **Step 4: 写第 3 篇文章**

```mdx
---
title: "Next.js 性能优化实践"
date: "2026-05-05"
author: "NexaCloud Team"
tags: ["nextjs", "performance", "optimization"]
excerpt: "Core Web Vitals 决定 SEO 排名和用户体验。本文系统梳理 Next.js 中的图片优化、字体优化、代码分割和缓存策略。"
coverImage: "/images/blog/performance.jpg"
---

# Next.js 性能优化实践

性能是功能。糟糕的 Core Web Vitals 不仅影响用户体验，还直接影响 Google 搜索排名。

## next/image

`next/image` 自动处理图片优化：

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority // 首屏图片添加 priority
/>
```

特性：WebP 自动转换、懒加载、防止 CLS（累积布局偏移）。

## next/font

`next/font` 内联字体，消除 FOUT（无样式文本闪烁）：

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return <html className={inter.className}>{children}</html>;
}
```

## 缓存策略

```tsx
// SSG：构建时生成，CDN 缓存
export const revalidate = false;

// ISR：定期重新生成
export const revalidate = 3600; // 每小时

// 动态：每次请求
export const dynamic = 'force-dynamic';
```

## 代码分割

`next/dynamic` 懒加载重型组件：

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,
});
```

## 结论

优先 SSG/ISR 减少服务器负载，用 `next/image` 和 `next/font` 消除常见性能陷阱，用 `dynamic` 延迟加载非关键组件。
```

- [ ] **Step 5: 类型检查**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add lib/mdx.ts content/
git commit -m "feat: add MDX utility functions and 3 blog articles"
```

---

### Task 16: 博客列表页 + 详情页

**Files:**
- Create: `components/blog/BlogCard.tsx`
- Create: `components/blog/BlogCard.module.css`
- Create: `components/blog/MDXRenderer.tsx`
- Create: `components/blog/MDXRenderer.module.css`
- Modify: `app/(marketing)/blog/page.tsx`
- Modify: `app/(marketing)/blog/[slug]/page.tsx`

- [ ] **Step 1: BlogCard 样式**

```css
/* components/blog/BlogCard.module.css */
.card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-4px);
}

.cover {
  height: 200px;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.body {
  padding: 24px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tag {
  background: rgba(102, 126, 234, 0.12);
  color: #a5b4fc;
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
}

.excerpt {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 16px;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-faint);
}
```

- [ ] **Step 2: BlogCard 组件**

```typescript
// components/blog/BlogCard.tsx
import Link from 'next/link';
import type { BlogPost } from '@/types';
import styles from './BlogCard.module.css';

type BlogCardProps = Omit<BlogPost, 'content'>;

const tagEmojis: Record<string, string> = {
  nextjs: '▲',
  react: '⚛',
  performance: '⚡',
  'server-components': '🖥',
  'app-router': '🗺',
  optimization: '🔧',
  tutorial: '📖',
};

export default function BlogCard({ slug, title, date, tags, excerpt, author }: BlogCardProps) {
  const emoji = tagEmojis[tags[0]] ?? '📝';

  return (
    <Link href={`/blog/${slug}`} className={styles.card}>
      <div className={styles.cover}>{emoji}</div>
      <div className={styles.body}>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.meta}>
          <span>{author}</span>
          <span>{new Date(date).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: MDXRenderer 样式**

```css
/* components/blog/MDXRenderer.module.css */
.prose {
  color: var(--color-text-muted);
  line-height: 1.9;
  font-size: 16px;
}

.prose h1, .prose h2, .prose h3 {
  color: var(--color-text);
  font-weight: 800;
  margin-top: 48px;
  margin-bottom: 16px;
  line-height: 1.3;
}

.prose h1 { font-size: 36px; }
.prose h2 { font-size: 28px; }
.prose h3 { font-size: 22px; }

.prose p { margin-bottom: 20px; }

.prose a {
  color: var(--color-primary);
  text-decoration: underline;
}

.prose ul, .prose ol {
  padding-left: 24px;
  margin-bottom: 20px;
}

.prose li { margin-bottom: 8px; }

.prose pre {
  background: #0d0d1a;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 24px;
  overflow-x: auto;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.7;
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.07);
  padding: 2px 6px;
  border-radius: 4px;
}

.prose pre code {
  background: none;
  padding: 0;
}

.prose blockquote {
  border-left: 3px solid var(--color-primary);
  padding-left: 20px;
  color: var(--color-text-muted);
  font-style: italic;
  margin-bottom: 20px;
}

.prose img {
  border-radius: var(--radius-md);
  margin: 24px 0;
}
```

- [ ] **Step 4: MDXRenderer（Client Component）**

```typescript
// components/blog/MDXRenderer.tsx
'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import styles from './MDXRenderer.module.css';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export default function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className={styles.prose}>
      <MDXRemote {...source} />
    </div>
  );
}
```

- [ ] **Step 5: 博客列表页（ISR）**

```typescript
// app/(marketing)/blog/page.tsx
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on Next.js, cloud infrastructure, and engineering best practices from the NexaCloud team.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="section-title">
          From the <span className="gradient-text">NexaCloud</span> blog
        </h1>
        <p className="section-subtitle">
          Engineering insights, product updates, and best practices for modern teams.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 博客详情页（SSG + generateStaticParams）**

```typescript
// app/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllSlugs, getPostBySlug } from '@/lib/mdx';
import MDXRenderer from '@/components/blog/MDXRenderer';

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = getPostBySlug(params.slug);
    return { title: post.title, description: post.excerpt };
  } catch {
    return { title: 'Post not found' };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const mdxSource = await serialize(post.content);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: 'rgba(102,126,234,0.12)',
                color: '#a5b4fc',
                border: '1px solid rgba(102,126,234,0.2)',
                padding: '2px 10px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '16px',
          }}
        >
          {post.title}
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', display: 'flex', gap: '16px' }}>
          <span>{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
      <MDXRenderer source={mdxSource} />
    </div>
  );
}
```

- [ ] **Step 7: 验证**

```bash
npm run dev
```

访问：
- `http://localhost:3000/blog` → 3 篇博客卡片
- `http://localhost:3000/blog/nextjs-app-router-guide` → 文章详情，Markdown 渲染正常

- [ ] **Step 8: Commit**

```bash
git add components/blog/ app/(marketing)/blog/
git commit -m "feat: add blog system with MDX support, list page (ISR), and dynamic slug routes"
```

---

## 阶段 05 · Metadata SEO & 性能优化

### Task 17: next/font + 全局 Metadata

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: 集成 next/font 并完善 Metadata**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | NexaCloud',
    default: 'NexaCloud — Cloud Collaboration Platform',
  },
  description:
    'The cloud collaboration platform built for modern enterprises. Scale without limits.',
  keywords: ['cloud', 'collaboration', 'enterprise', 'SaaS', 'team productivity'],
  authors: [{ name: 'NexaCloud Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexacloud.example.com',
    siteName: 'NexaCloud',
    title: 'NexaCloud — Cloud Collaboration Platform',
    description: 'The cloud collaboration platform built for modern enterprises.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaCloud',
    description: 'The cloud collaboration platform built for modern enterprises.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: 更新 globals.css 中的字体变量引用**

在 `app/globals.css` 的 `:root` 中修改：

```css
--font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;
```

- [ ] **Step 3: 验证构建**

```bash
npm run build
```

Expected: 输出构建成功，各页面标注 `○ Static` 或 `◐ ISR`。

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add next/font, complete OG and SEO metadata (phase 05 complete)"
```

---

## 阶段 06 · Route Handlers & 部署

### Task 18: 联系表单 Route Handler

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `.env.local`

- [ ] **Step 1: 创建 .env.local**

```bash
# .env.local
CONTACT_EMAIL=your@email.com
```

> **注意：** `.env.local` 已在 `.gitignore` 中，不会提交。

- [ ] **Step 2: 写 Route Handler**

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'name, email, and message are required' },
      { status: 422 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 422 });
  }

  // 实际项目：接入 SendGrid / Resend / Nodemailer
  console.log('Contact form submission:', { name, email, message });

  return NextResponse.json(
    { success: true, message: 'Message received. We will get back to you within 24 hours.' },
    { status: 200 }
  );
}
```

- [ ] **Step 3: 验证 API**

```bash
npm run dev
```

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

Expected 响应：
```json
{"success":true,"message":"Message received. We will get back to you within 24 hours."}
```

验证缺字段报 422：
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

Expected：`{"error":"name, email, and message are required"}`

- [ ] **Step 4: 类型检查 + 最终构建**

```bash
npx tsc --noEmit
npm run build
```

Expected: 构建成功，无 TypeScript 错误。

- [ ] **Step 5: Commit**

```bash
git add app/api/
git commit -m "feat: add contact form Route Handler with validation"
```

---

### Task 19: Vercel 部署

- [ ] **Step 1: 推送到 GitHub**

在 GitHub 创建新仓库 `nexacloud`，然后：

```bash
git remote add origin https://github.com/<your-username>/nexacloud.git
git push -u origin master
```

- [ ] **Step 2: 连接 Vercel**

1. 访问 [vercel.com](https://vercel.com) → New Project
2. 导入 GitHub 仓库 `nexacloud`
3. Framework: Next.js（自动检测）
4. Environment Variables: 添加 `CONTACT_EMAIL`
5. 点击 Deploy

- [ ] **Step 3: 验证部署**

部署完成后访问 Vercel 提供的 URL：
- 首页渲染正常
- `/features`、`/pricing`、`/blog` 均可访问
- `/blog/nextjs-app-router-guide` 文章详情正常
- `/api/contact` POST 请求返回 200

- [ ] **Step 4: 最终 commit**

```bash
git add .
git commit -m "feat: complete NexaCloud enterprise website (all 6 phases done)"
git push
```

---

## 自检清单

| 规格要求 | 实现任务 |
|---------|---------|
| App Router + 路由组 (marketing) | Task 6 |
| TypeScript + CSS Modules | Task 1, 全部组件 |
| 首页 Hero/FeatureGrid/StatsBar/Testimonials/CTA | Task 8-11 |
| 功能页 SSG | Task 12 |
| 定价页 月/年切换 Client Component | Task 13 |
| 博客 ISR + 动态路由 + MDX | Task 14-16 |
| generateStaticParams | Task 16 Step 6 |
| next/font + generateMetadata | Task 17 |
| Route Handler POST + 验证 | Task 18 |
| Vercel 部署 | Task 19 |
| 渐变大胆风 CSS 变量体系 | Task 3 |
