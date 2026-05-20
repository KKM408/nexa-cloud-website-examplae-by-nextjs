# Route Handlers（API 路由）

## 基本结构

文件位置：`app/api/<路径>/route.ts`，导出以 HTTP 方法命名的函数：

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: [] });
}
```

## 本项目联系表单 API

```typescript
export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  // 必填字段验证
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'name, email, and message are required' },
      { status: 422 }
    );
  }

  // 邮箱格式验证
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 422 }
    );
  }

  // 实际项目中：发邮件 / 存数据库
  return NextResponse.json(
    { success: true, message: 'We will get back to you within 24 hours.' },
    { status: 200 }
  );
}
```

## 测试 Route Handler

```bash
# 正常请求
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"a@b.com","message":"你好"}'
# → {"success":true,"message":"..."}

# 缺字段
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"张三"}'
# → {"error":"name, email, and message are required"} 422
```

## 环境变量

```bash
# .env.local（不提交 git）
CONTACT_EMAIL=your@email.com
```

```typescript
// 在 Route Handler 中读取
const contactEmail = process.env.CONTACT_EMAIL;
```

Vercel 部署时在 Dashboard → Settings → Environment Variables 添加。

## 与 Pages Router API Routes 对比

| | Pages Router | App Router Route Handler |
|---|---|---|
| 文件位置 | `pages/api/contact.ts` | `app/api/contact/route.ts` |
| 导出方式 | `export default handler` | `export async function POST` |
| 请求对象 | `NextApiRequest` | `NextRequest` |
| 响应方式 | `res.json({})` | `NextResponse.json({})` |
