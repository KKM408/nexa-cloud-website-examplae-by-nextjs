# NexaCloud 企业官网 · 设计规格

**日期:** 2026-05-19  
**项目:** Next.js 学习实战 — SaaS 企业官网  
**虚构公司:** NexaCloud（云端协作 SaaS 平台）

---

## 目标

通过构建完整企业官网，系统掌握 Next.js 15 App Router 核心知识点。React 基础已具备，Next.js 从零开始。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | CSS Modules + CSS 变量 |
| 内容 | MDX + gray-matter + next-mdx-remote |
| 部署 | Vercel |

---

## 视觉风格

渐变大胆风：紫色渐变背景 (`#667eea → #764ba2`) + 毛玻璃效果 (backdrop-filter)。参考：Framer、Loom。

CSS 变量体系：
```css
--color-primary: #667eea;
--color-secondary: #764ba2;
--color-bg: #0f0f1a;
--color-surface: rgba(255,255,255,0.05);
--color-border: rgba(255,255,255,0.1);
```

---

## 页面规划

| 页面 | 路由 | 渲染策略 | 阶段 |
|------|------|----------|------|
| 首页 | `/` | SSG | 02 |
| 功能页 | `/features` | SSG | 03 |
| 定价页 | `/pricing` | SSG | 03 |
| 博客列表 | `/blog` | ISR (3600s) | 04 |
| 博客详情 | `/blog/[slug]` | SSG (generateStaticParams) | 04 |

---

## 目录结构

```
nextjs-study/
├── app/
│   ├── (marketing)/          # 路由组，共享营销布局
│   │   ├── page.tsx          # 首页
│   │   ├── features/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── blog/
│   │       ├── page.tsx      # 博客列表
│   │       └── [slug]/page.tsx
│   ├── api/
│   │   └── contact/route.ts  # 联系表单 Route Handler
│   ├── layout.tsx            # 根布局（Navbar + Footer）
│   └── globals.css
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── home/                 # Hero, FeatureGrid, StatsBar, Testimonials, CTA
│   ├── features/             # FeatureDetail, ComparisonTable
│   ├── pricing/              # PricingCard, BillingToggle, PricingFAQ
│   ├── blog/                 # BlogCard, BlogList, MDXRenderer
│   └── ui/                   # Button, Badge, Card, GlassCard
├── content/
│   └── blog/                 # *.mdx 博客文章
├── lib/
│   └── mdx.ts               # 读取/解析 MDX 文件
└── types/
    └── index.ts              # Blog, Feature, PricingPlan 等类型
```

---

## 6 阶段学习计划

### 阶段 01 · 环境搭建 & App Router 核心
**知识点:** create-next-app · 文件路由 · layout.tsx · page.tsx · Link · useRouter  
**产出:** 项目骨架 + Navbar + Footer + 4 个路由页面空壳

### 阶段 02 · Server Components & Client Components  
**知识点:** 'use client' · RSC 数据流 · Hydration · 组件边界划分  
**产出:** 首页完整实现（Hero · FeatureGrid · StatsBar · Testimonials · CTA）

### 阶段 03 · 数据获取 & 渲染策略  
**知识点:** fetch + cache · SSG · SSR · ISR · loading.tsx · Suspense · error.tsx  
**产出:** 功能页 + 定价页（含月/年切换交互）

### 阶段 04 · 动态路由 & 博客系统  
**知识点:** [slug] 动态路由 · generateStaticParams · MDX · gray-matter  
**产出:** 博客列表页 + 博客详情页 + 3 篇示例 MDX 文章

### 阶段 05 · Metadata SEO & 性能优化  
**知识点:** generateMetadata · OG 图像 · next/image · next/font · Core Web Vitals  
**产出:** 全站 SEO 配置 + 图片懒加载 + 字体优化

### 阶段 06 · Route Handlers & 部署  
**知识点:** Route Handlers (POST) · 表单验证 · 环境变量 · Vercel 部署  
**产出:** 联系表单后端 API + GitHub 仓库 + Vercel 线上地址

---

## 首页 Section 规划

```
Navbar (固定顶部，毛玻璃背景)
  └── Logo + 导航链接 + CTA 按钮

Hero
  └── 大标题 + 副标题 + 主/次 CTA + 产品截图/动画

FeatureGrid (3 列)
  └── 6 个核心功能卡片（图标 + 标题 + 描述）

StatsBar
  └── 50K+ 用户 · 99.9% SLA · 500+ 集成 · 4.9★

Testimonials
  └── 3 个客户评价卡片（毛玻璃风格）

PricingPreview
  └── 3 个套餐简版预览 → 链接到定价页

CTA Section
  └── 全宽渐变背景 + 注册号召

Footer
  └── Logo + 链接矩阵 + 版权
```

---

## 定价页规划

- 3 档套餐：Free · Pro ($29/月) · Enterprise (定制)
- 月/年切换（Client Component，年付 20% 折扣）
- 功能对比表（✓ / ✗）
- FAQ 折叠组件

---

## 博客系统规划

frontmatter 格式：
```yaml
---
title: "文章标题"
date: "2026-05-19"
author: "NexaCloud Team"
tags: ["nextjs", "performance"]
excerpt: "摘要..."
coverImage: "/images/blog/cover.jpg"
---
```

示例文章（3 篇）：
1. `nextjs-app-router-guide.mdx` — App Router 完全指南
2. `server-components-deep-dive.mdx` — Server Components 深度解析
3. `performance-optimization.mdx` — Next.js 性能优化实践

---

## 数据流

```
MDX 文件 (content/blog/)
  → lib/mdx.ts (gray-matter 解析)
  → app/blog/page.tsx (Server Component，ISR)
  → BlogCard 组件列表

MDX 文件 (content/blog/[slug].mdx)
  → generateStaticParams (构建时预生成)
  → app/blog/[slug]/page.tsx
  → MDXRenderer (Client Component)
```

---

## 不在范围内

- 用户认证 / 登录系统
- 数据库集成
- 实际支付集成
- 后台管理系统
- 多语言 i18n
