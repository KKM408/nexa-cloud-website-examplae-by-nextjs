import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      password,
      name: 'Zhang',
      bio: 'Full-stack developer. Writing about Next.js, NestJS and TypeScript.',
      avatar: null,
    },
  });

  // Categories
  const [catFrontend, catBackend, catAI] = await Promise.all([
    prisma.category.upsert({ where: { slug: 'frontend' }, update: {}, create: { name: '前端', slug: 'frontend' } }),
    prisma.category.upsert({ where: { slug: 'backend' }, update: {}, create: { name: '后端', slug: 'backend' } }),
    prisma.category.upsert({ where: { slug: 'ai' }, update: {}, create: { name: 'AI', slug: 'ai' } }),
  ]);

  // Tags
  const [tTS, tReact, tVue, tJS, tNode, tNest, tPrisma, tCSS, tLLM, tPerf] = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React.js', slug: 'react' } }),
    prisma.tag.upsert({ where: { slug: 'vuejs' }, update: {}, create: { name: 'Vue.js', slug: 'vuejs' } }),
    prisma.tag.upsert({ where: { slug: 'javascript' }, update: {}, create: { name: 'JavaScript', slug: 'javascript' } }),
    prisma.tag.upsert({ where: { slug: 'nodejs' }, update: {}, create: { name: 'Node.js', slug: 'nodejs' } }),
    prisma.tag.upsert({ where: { slug: 'nestjs' }, update: {}, create: { name: 'NestJS', slug: 'nestjs' } }),
    prisma.tag.upsert({ where: { slug: 'prisma' }, update: {}, create: { name: 'Prisma', slug: 'prisma' } }),
    prisma.tag.upsert({ where: { slug: 'css' }, update: {}, create: { name: 'CSS', slug: 'css' } }),
    prisma.tag.upsert({ where: { slug: 'llm' }, update: {}, create: { name: 'LLM', slug: 'llm' } }),
    prisma.tag.upsert({ where: { slug: 'performance' }, update: {}, create: { name: 'Performance', slug: 'performance' } }),
  ]);

  const posts = [
    {
      slug: 'getting-started-with-nextjs-16',
      title: 'Getting Started with Next.js 16',
      excerpt: 'A complete guide to building modern web apps with Next.js 16 App Router, Server Components and streaming.',
      content: `# Getting Started with Next.js 16\n\nNext.js 16 introduces powerful new primitives for building full-stack web apps.\n\n## App Router\n\nThe App Router is now the default. Every file inside \`app/\` is a Server Component by default.\n\n\`\`\`tsx\nexport default function Page() {\n  return <h1>Hello World</h1>;\n}\n\`\`\`\n\n## Key Features\n\n- Server Components by default\n- Streaming with Suspense\n- File-based routing\n- Built-in image / font optimization\n`,
      published: true, featured: true, readingTime: 5, views: 320,
      categoryId: catFrontend.id,
      tagIds: [tTS.id, tReact.id],
    },
    {
      slug: 'mastering-typescript-generics',
      title: 'Mastering TypeScript Generics',
      excerpt: 'Deep dive into TypeScript generics: constraints, conditional types, infer keyword, and real-world patterns.',
      content: `# Mastering TypeScript Generics\n\nGenerics are one of TypeScript's most powerful features.\n\n## Basic Syntax\n\n\`\`\`ts\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\`\`\`\n\n## Constraints\n\n\`\`\`ts\nfunction getLength<T extends { length: number }>(arg: T): number {\n  return arg.length;\n}\n\`\`\`\n\n## Conditional Types\n\n\`\`\`ts\ntype IsString<T> = T extends string ? true : false;\n\`\`\`\n`,
      published: true, featured: true, readingTime: 8, views: 215,
      categoryId: catFrontend.id,
      tagIds: [tTS.id, tJS.id],
    },
    {
      slug: 'react-server-components-deep-dive',
      title: 'React Server Components Deep Dive',
      excerpt: 'Understanding the mental model behind React Server Components, when to use them, and common pitfalls to avoid.',
      content: `# React Server Components Deep Dive\n\nServer Components render on the server and send HTML to the client — no JS bundle cost.\n\n## Rules\n\n- Cannot use \`useState\`, \`useEffect\`, or browser APIs\n- Can \`async/await\` directly\n- Can import server-only modules\n\n## Example\n\n\`\`\`tsx\nasync function PostList() {\n  const posts = await db.post.findMany();\n  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;\n}\n\`\`\`\n`,
      published: true, featured: false, readingTime: 10, views: 187,
      categoryId: catFrontend.id,
      tagIds: [tReact.id, tTS.id],
    },
    {
      slug: 'vue3-composition-api-guide',
      title: 'Vue 3 Composition API 完全指南',
      excerpt: 'Vue 3 Composition API 核心概念：setup、ref、reactive、computed、watch 及最佳实践。',
      content: `# Vue 3 Composition API 完全指南\n\n## setup()\n\n\`\`\`vue\n<script setup>\nimport { ref, computed } from 'vue';\nconst count = ref(0);\nconst double = computed(() => count.value * 2);\n</script>\n\`\`\`\n\n## reactive vs ref\n\n- \`ref\` 适合原始值，需要 \`.value\` 访问\n- \`reactive\` 适合对象，直接访问属性\n`,
      published: true, featured: false, readingTime: 7, views: 142,
      categoryId: catFrontend.id,
      tagIds: [tVue.id, tJS.id],
    },
    {
      slug: 'css-modern-layout-techniques',
      title: '现代 CSS 布局技术：Grid 与 Flexbox 实战',
      excerpt: '深入对比 CSS Grid 和 Flexbox，配合真实场景案例，覆盖容器查询、逻辑属性等新特性。',
      content: `# 现代 CSS 布局技术\n\n## Flexbox\n\n适合一维布局：导航栏、工具栏、卡片行。\n\n\`\`\`css\n.container {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}\n\`\`\`\n\n## Grid\n\n适合二维布局：页面骨架、图片画廊。\n\n\`\`\`css\n.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 280px;\n  gap: 20px;\n}\n\`\`\`\n`,
      published: true, featured: false, readingTime: 6, views: 98,
      categoryId: catFrontend.id,
      tagIds: [tCSS.id, tJS.id],
    },
    {
      slug: 'nestjs-prisma-rest-api',
      title: 'Building a REST API with NestJS and Prisma',
      excerpt: 'Step-by-step guide to building a production-ready REST API using NestJS, Prisma ORM, and PostgreSQL.',
      content: `# Building a REST API with NestJS and Prisma\n\n## Project Structure\n\n\`\`\`\nsrc/\n├── auth/\n├── posts/\n├── prisma/\n└── main.ts\n\`\`\`\n\n## PrismaService\n\n\`\`\`ts\n@Injectable()\nexport class PrismaService extends PrismaClient implements OnModuleInit {\n  async onModuleInit() {\n    await this.$connect();\n  }\n}\n\`\`\`\n\n## Guard-Protected Routes\n\n\`\`\`ts\n@UseGuards(JwtAuthGuard)\n@Post()\ncreate(@Body() dto: CreatePostDto, @Request() req) {\n  return this.postsService.create(dto, req.user.id);\n}\n\`\`\`\n`,
      published: true, featured: true, readingTime: 12, views: 276,
      categoryId: catBackend.id,
      tagIds: [tNest.id, tPrisma.id],
    },
    {
      slug: 'nodejs-event-loop-explained',
      title: 'Node.js Event Loop 深度解析',
      excerpt: '彻底搞懂 Node.js 事件循环：宏任务、微任务、libuv 线程池与 I/O 回调执行顺序。',
      content: `# Node.js Event Loop 深度解析\n\n## 六个阶段\n\n1. timers — setTimeout / setInterval\n2. pending callbacks\n3. idle, prepare\n4. poll — I/O\n5. check — setImmediate\n6. close callbacks\n\n## 微任务优先\n\n每个阶段结束后先清空 Promise microtask queue，再进入下一阶段。\n\n\`\`\`js\nsetTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promise'));\n// 输出: promise → timeout\n\`\`\`\n`,
      published: true, featured: false, readingTime: 9, views: 163,
      categoryId: catBackend.id,
      tagIds: [tNode.id, tJS.id],
    },
    {
      slug: 'prisma-multi-file-schema',
      title: 'Prisma Multi-File Schema with prismaSchemaFolder',
      excerpt: 'How to split a monolithic Prisma schema into multiple files using the prismaSchemaFolder preview feature.',
      content: `# Prisma Multi-File Schema\n\n## Enable Preview Feature\n\n\`\`\`prisma\ngenerator client {\n  provider        = "prisma-client-js"\n  previewFeatures = ["prismaSchemaFolder"]\n}\n\`\`\`\n\n## File Structure\n\n\`\`\`\nprisma/schema/\n├── base.prisma\n├── user.prisma\n├── post.prisma\n├── category.prisma\n└── tag.prisma\n\`\`\`\n\n## package.json\n\n\`\`\`json\n{\n  "prisma": {\n    "schema": "prisma/schema"\n  }\n}\n\`\`\`\n`,
      published: true, featured: false, readingTime: 4, views: 89,
      categoryId: catBackend.id,
      tagIds: [tPrisma.id, tNest.id],
    },
    {
      slug: 'llm-prompt-engineering-guide',
      title: 'Prompt Engineering 实战指南',
      excerpt: '系统梳理 Prompt Engineering 核心技巧：Few-shot、Chain-of-Thought、角色设定与输出格式控制。',
      content: `# Prompt Engineering 实战指南\n\n## Few-shot Prompting\n\n给模型几个示例，引导输出格式：\n\n\`\`\`\n输入: 苹果\n输出: 水果\n\n输入: 猫\n输出: 动物\n\n输入: Next.js\n输出:\n\`\`\`\n\n## Chain-of-Thought\n\n要求模型逐步推理：\n\n> "请一步步思考，然后给出最终答案"\n\n## 结构化输出\n\n\`\`\`\n请以 JSON 格式返回，字段：title, summary, tags[]\n\`\`\`\n`,
      published: true, featured: true, readingTime: 8, views: 401,
      categoryId: catAI.id,
      tagIds: [tLLM.id],
    },
    {
      slug: 'building-ai-app-with-claude-api',
      title: '使用 Claude API 构建智能应用',
      excerpt: '从零开始接入 Anthropic Claude API，实现流式对话、工具调用（Tool Use）与多轮上下文管理。',
      content: `# 使用 Claude API 构建智能应用\n\n## 安装 SDK\n\n\`\`\`bash\nnpm install @anthropic-ai/sdk\n\`\`\`\n\n## 基础对话\n\n\`\`\`ts\nimport Anthropic from '@anthropic-ai/sdk';\n\nconst client = new Anthropic();\nconst message = await client.messages.create({\n  model: 'claude-sonnet-4-6',\n  max_tokens: 1024,\n  messages: [{ role: 'user', content: 'Hello, Claude!' }],\n});\nconsole.log(message.content);\n\`\`\`\n\n## 流式输出\n\n\`\`\`ts\nconst stream = await client.messages.stream({ ... });\nfor await (const chunk of stream) {\n  process.stdout.write(chunk.delta?.text ?? '');\n}\n\`\`\`\n`,
      published: true, featured: false, readingTime: 11, views: 234,
      categoryId: catAI.id,
      tagIds: [tLLM.id, tTS.id],
    },
  ];

  for (const { tagIds, ...data } of posts) {
    await prisma.post.upsert({
      where: { slug: data.slug },
      update: { categoryId: data.categoryId, published: data.published, featured: data.featured },
      create: {
        ...data,
        authorId: user.id,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    });
  }

  console.log('✅ Seed complete: 10 posts');
  console.log('👤 Admin login: admin@blog.com / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
