# CSS Modules & 设计系统

## CSS Modules

每个组件一个 `.module.css` 文件，类名**自动哈希隔离**，不污染全局：

```
components/
├── layout/
│   ├── Navbar.tsx
│   └── Navbar.module.css   ← 只作用于 Navbar
├── ui/
│   ├── Button.tsx
│   └── Button.module.css
```

```css
/* Button.module.css */
.button {
  padding: 12px 24px;
  border-radius: 8px;
}

.primary {
  background: var(--gradient-primary);
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

export default function Button({ variant = 'primary' }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
// 编译后类名变为: Button_button__xK2p1 Button_primary__9aQ3m
```

## 全局 CSS 变量设计系统

在 `globals.css` 定义，所有组件通过变量引用：

```css
/* app/globals.css */
:root {
  /* 色彩 */
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-bg: #0f0f1a;
  --color-bg-secondary: #1a1a2e;
  --color-surface: rgba(255, 255, 255, 0.05);
  --color-border: rgba(255, 255, 255, 0.1);
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;

  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* 字体 */
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;

  /* 布局 */
  --nav-height: 72px;
  --container-max: 1200px;

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 100px;
}
```

## 毛玻璃效果（Glassmorphism）

```css
.glassCard {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);  /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}
```

## 渐变文字

```css
.gradientText {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

```tsx
<h1>
  Cloud Collaboration{' '}
  <span className="gradient-text">Reimagined</span>
</h1>
```

## 响应式布局模式

```css
/* 容器 */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
}

/* 响应式字体 */
.title {
  font-size: clamp(36px, 6vw, 72px);
  /* clamp(最小值, 视口比例, 最大值) */
}

/* 网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
```
