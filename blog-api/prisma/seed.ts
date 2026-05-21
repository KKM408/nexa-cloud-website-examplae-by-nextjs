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
      name: 'Admin',
      bio: 'Full-stack developer & writer.',
    },
  });

  const nextjsCat = await prisma.category.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: { name: 'Next.js', slug: 'nextjs' },
  });

  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } }),
    prisma.tag.upsert({ where: { slug: 'performance' }, update: {}, create: { name: 'Performance', slug: 'performance' } }),
  ]);

  await prisma.post.upsert({
    where: { slug: 'getting-started-with-nextjs-16' },
    update: {},
    create: {
      slug: 'getting-started-with-nextjs-16',
      title: 'Getting Started with Next.js 16',
      excerpt: 'A complete guide to building modern web apps with Next.js 16 App Router.',
      content: `# Getting Started with Next.js 16\n\nNext.js 16 brings exciting new features...\n\n## App Router\n\nThe App Router is the recommended way to build Next.js applications.\n\n\`\`\`typescript\nexport default function Page() {\n  return <h1>Hello World</h1>;\n}\n\`\`\`\n\n## Key Features\n\n- Server Components by default\n- File-based routing\n- Built-in optimization\n`,
      published: true,
      featured: true,
      readingTime: 5,
      authorId: user.id,
      categoryId: nextjsCat.id,
      tags: { create: [{ tagId: tags[0].id }, { tagId: tags[1].id }] },
    },
  });

  console.log('✅ Seed complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());
