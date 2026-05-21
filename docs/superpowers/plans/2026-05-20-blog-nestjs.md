# 个人博客 + NestJS 后端 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 nexacloud 改造为高端个人博客，新建 NestJS 后端提供文章/分类/标签 CRUD API，Next.js 通过 ISR 拉取数据展示。

**Architecture:** NestJS + Prisma + PostgreSQL 作为 Headless CMS API；Next.js 通过 `lib/api.ts` 封装的 fetch 调用后端，文章列表 ISR(3600s)，文章详情 SSG+revalidate；评论用 Giscus（GitHub Issues 驱动，零后端）；图片用 Cloudinary。

**Tech Stack:** NestJS · Prisma · PostgreSQL(Docker) · JWT · Next.js 16 · TypeScript · Shiki · Giscus · Cloudinary · CSS Modules

---

## 目录结构

### 后端（新项目）
```
D:\Desktop\_My\nestjs-study\blog-api\
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── posts/
│   │   ├── posts.module.ts
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   └── dto/
│   │       ├── create-post.dto.ts
│   │       └── update-post.dto.ts
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   └── categories.service.ts
│   ├── tags/
│   │   ├── tags.module.ts
│   │   ├── tags.controller.ts
│   │   └── tags.service.ts
│   ├── upload/
│   │   ├── upload.module.ts
│   │   └── upload.controller.ts
│   ├── prisma/
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docker-compose.yml
└── .env
```

### 前端（改造 nexacloud）
```
nexacloud/
├── app/
│   ├── (blog)/
│   │   ├── layout.tsx           # 博客布局（无 NexaCloud 内容）
│   │   ├── page.tsx             # 首页：个人 Hero + 近期文章
│   │   ├── posts/
│   │   │   ├── page.tsx         # 文章列表（ISR）
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # 文章详情（SSG + Shiki + Giscus）
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx  # 分类页
│   │   ├── tags/
│   │   │   └── [slug]/page.tsx  # 标签页
│   │   └── about/page.tsx       # 关于我
│   ├── admin/
│   │   ├── layout.tsx           # Admin 布局（JWT 验证）
│   │   ├── page.tsx             # 文章管理列表
│   │   ├── posts/
│   │   │   ├── new/page.tsx     # 新建文章
│   │   │   └── [id]/edit/page.tsx
│   │   └── login/page.tsx
│   ├── api/
│   │   └── revalidate/route.ts  # ISR webhook
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── blog/
│   │   ├── PostCard.tsx         # 文章卡片
│   │   ├── PostGrid.tsx         # 卡片网格
│   │   ├── ReadingProgress.tsx  # 顶部阅读进度条（Client）
│   │   ├── TableOfContents.tsx  # 文章目录（Client）
│   │   ├── GiscusComments.tsx   # 评论（Client）
│   │   └── TagBadge.tsx
│   ├── home/
│   │   ├── PersonalHero.tsx     # 个人介绍 Hero
│   │   └── FeaturedPosts.tsx    # 精选文章
│   └── admin/
│       └── PostEditor.tsx       # Markdown 编辑器（Client）
└── lib/
    ├── api.ts                   # NestJS API 客户端
    └── types.ts                 # 共享类型
```

---

## Phase A · NestJS 后端

### Task 1: 初始化 NestJS 项目 + Docker PostgreSQL

**Files:**
- Create: `blog-api/docker-compose.yml`
- Create: `blog-api/.env`
- Create: `blog-api/src/app.module.ts`（修改）

- [ ] **Step 1: 新建 NestJS 项目**

```bash
cd "D:\Desktop\_My\nestjs-study"
npx @nestjs/cli new blog-api --package-manager npm
cd blog-api
```

- [ ] **Step 2: 安装依赖**

```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs class-validator class-transformer @prisma/client
npm install --save-dev prisma @types/bcryptjs @types/passport-jwt
```

- [ ] **Step 3: 创建 docker-compose.yml**

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: blog
      POSTGRES_PASSWORD: blog123
      POSTGRES_DB: blog_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- [ ] **Step 4: 创建 .env**

```env
DATABASE_URL="postgresql://blog:blog123@localhost:5432/blog_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
REVALIDATE_SECRET="your-revalidate-secret"
PORT=3001
```

- [ ] **Step 5: 启动 PostgreSQL**

```bash
docker-compose up -d
```

Expected: PostgreSQL 容器运行在 5432 端口。

- [ ] **Step 6: 配置 app.module.ts**

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
```

- [ ] **Step 7: 配置 main.ts**

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: 'http://localhost:3000' });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

- [ ] **Step 8: 验证启动**

```bash
npm run start:dev
```

Expected: `Application is running on: http://[::1]:3001`

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: initialize NestJS blog-api with Docker PostgreSQL"
```

---

### Task 2: Prisma Schema + 数据库迁移

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/prisma/prisma.service.ts`
- Modify: `src/app.module.ts`

- [ ] **Step 1: 初始化 Prisma**

```bash
npx prisma init
```

- [ ] **Step 2: 编写 schema.prisma**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  bio       String?
  avatar    String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id          Int        @id @default(autoincrement())
  slug        String     @unique
  title       String
  excerpt     String
  content     String     @db.Text
  coverImage  String?
  published   Boolean    @default(false)
  featured    Boolean    @default(false)
  readingTime Int        @default(1)
  views       Int        @default(0)
  author      User       @relation(fields: [authorId], references: [id])
  authorId    Int
  category    Category   @relation(fields: [categoryId], references: [id])
  categoryId  Int
  tags        PostTag[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  posts Post[]
}

model Tag {
  id    Int       @id @default(autoincrement())
  name  String    @unique
  slug  String    @unique
  posts PostTag[]
}

model PostTag {
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId Int
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId  Int
  @@id([postId, tagId])
}
```

- [ ] **Step 3: 运行迁移**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Expected: `Your database is now in sync with your schema.`

- [ ] **Step 4: 创建 PrismaService**

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

- [ ] **Step 5: 注册 PrismaModule（inline 在 AppModule）**

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add Prisma schema with Post/Category/Tag/User models"
```

---

### Task 3: Auth 模块（JWT + bcrypt）

**Files:**
- Create: `src/auth/auth.module.ts`
- Create: `src/auth/auth.controller.ts`
- Create: `src/auth/auth.service.ts`
- Create: `src/auth/jwt.strategy.ts`
- Create: `src/auth/guards/jwt-auth.guard.ts`
- Create: `src/auth/dto/login.dto.ts`

- [ ] **Step 1: 创建 login DTO**

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

- [ ] **Step 2: 创建 JWT Strategy**

```typescript
// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return { id: payload.sub, email: payload.email };
  }
}
```

- [ ] **Step 3: 创建 JWT Guard**

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 4: 创建 AuthService**

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { access_token: token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async register(email: string, password: string, name: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashed, name },
    });
    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { access_token: token };
  }
}
```

- [ ] **Step 5: 创建 AuthController**

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}
```

- [ ] **Step 6: 创建 AuthModule + 注册到 AppModule**

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '7d') },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
```

```typescript
// src/app.module.ts（更新）
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
```

- [ ] **Step 7: 验证**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

Expected: `{"message":"Invalid credentials"}` 401（无用户时正常）

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add JWT auth module with login endpoint"
```

---

### Task 4: Posts 模块（CRUD + 分页 + 搜索）

**Files:**
- Create: `src/posts/dto/create-post.dto.ts`
- Create: `src/posts/dto/update-post.dto.ts`
- Create: `src/posts/posts.service.ts`
- Create: `src/posts/posts.controller.ts`
- Create: `src/posts/posts.module.ts`

- [ ] **Step 1: 创建 DTO**

```typescript
// src/posts/dto/create-post.dto.ts
import { IsString, IsBoolean, IsOptional, IsArray, IsInt, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  slug: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsInt()
  categoryId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[];
}
```

```typescript
// src/posts/dto/update-post.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
```

- [ ] **Step 2: 创建 PostsService**

```typescript
// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, category?: string, tag?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { published: true };

    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, avatar: true } },
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return { posts, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findFeatured() {
    return this.prisma.post.findMany({
      where: { published: true, featured: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, avatar: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, avatar: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.post.update({ where: { slug }, data: { views: { increment: 1 } } });
    return post;
  }

  async create(dto: CreatePostDto, authorId: number) {
    const { tagIds, ...data } = dto;
    return this.prisma.post.create({
      data: {
        ...data,
        authorId,
        tags: tagIds ? { create: tagIds.map((tagId) => ({ tagId })) } : undefined,
      },
      include: { category: true, tags: { include: { tag: true } } },
    });
  }

  async update(id: number, dto: UpdatePostDto) {
    const { tagIds, ...data } = dto;
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();

    if (tagIds !== undefined) {
      await this.prisma.postTag.deleteMany({ where: { postId: id } });
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        ...(tagIds && { tags: { create: tagIds.map((tagId) => ({ tagId })) } }),
      },
      include: { category: true, tags: { include: { tag: true } } },
    });
  }

  async remove(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    return this.prisma.post.delete({ where: { id } });
  }

  async getAllSlugs() {
    return this.prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
  }
}
```

- [ ] **Step 3: 创建 PostsController**

```typescript
// src/posts/posts.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    return this.posts.findAll(page, limit, category, tag, search);
  }

  @Get('featured')
  findFeatured() {
    return this.posts.findFeatured();
  }

  @Get('slugs')
  getAllSlugs() {
    return this.posts.getAllSlugs();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.posts.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDto, @Request() req: any) {
    return this.posts.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return this.posts.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.posts.remove(id);
  }
}
```

- [ ] **Step 4: 创建 PostsModule + 注册到 AppModule**

```typescript
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PostsService, PrismaService],
  controllers: [PostsController],
})
export class PostsModule {}
```

```typescript
// src/app.module.ts（更新）
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PostsModule],
  providers: [PrismaService],
})
export class AppModule {}
```

- [ ] **Step 5: 验证**

```bash
curl http://localhost:3001/api/posts
```

Expected: `{"posts":[],"total":0,"page":1,"totalPages":0}`

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add Posts module with CRUD, pagination, search"
```

---

### Task 5: Categories + Tags 模块

**Files:**
- Create: `src/categories/categories.module.ts`
- Create: `src/categories/categories.controller.ts`
- Create: `src/categories/categories.service.ts`
- Create: `src/tags/tags.module.ts`
- Create: `src/tags/tags.controller.ts`
- Create: `src/tags/tags.service.ts`

- [ ] **Step 1: CategoriesService**

```typescript
// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  create(name: string, slug: string) {
    return this.prisma.category.create({ data: { name, slug } });
  }
}
```

- [ ] **Step 2: CategoriesController**

```typescript
// src/categories/categories.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categories: CategoriesService) {}

  @Get()
  findAll() {
    return this.categories.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.categories.create(body.name, body.slug);
  }
}
```

- [ ] **Step 3: CategoriesModule**

```typescript
// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CategoriesService, PrismaService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
```

- [ ] **Step 4: TagsService**

```typescript
// src/tags/tags.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  create(name: string, slug: string) {
    return this.prisma.tag.create({ data: { name, slug } });
  }
}
```

- [ ] **Step 5: TagsController**

```typescript
// src/tags/tags.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private tags: TagsService) {}

  @Get()
  findAll() {
    return this.tags.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.tags.create(body.name, body.slug);
  }
}
```

- [ ] **Step 6: TagsModule + 注册全部到 AppModule**

```typescript
// src/tags/tags.module.ts
import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TagsService, PrismaService],
  controllers: [TagsController],
})
export class TagsModule {}
```

```typescript
// src/app.module.ts（最终）
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add Categories and Tags modules"
```

---

### Task 6: Seed 数据（初始 Admin + 示例文章）

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json`

- [ ] **Step 1: 创建 seed.ts**

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
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

  // Categories
  const nextjsCat = await prisma.category.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: { name: 'Next.js', slug: 'nextjs' },
  });

  // Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } }),
    prisma.tag.upsert({ where: { slug: 'performance' }, update: {}, create: { name: 'Performance', slug: 'performance' } }),
  ]);

  // Sample post
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
```

- [ ] **Step 2: 配置 package.json**

在 `package.json` 添加：

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

- [ ] **Step 3: 运行 seed**

```bash
npx prisma db seed
```

Expected: `✅ Seed complete`

- [ ] **Step 4: 验证数据**

```bash
curl http://localhost:3001/api/posts/featured
```

Expected: 返回 1 篇文章的 JSON 数组。

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add seed data with admin user and sample post"
```

---

## Phase B · Next.js 博客前端改造

### Task 7: 依赖安装 + 共享类型 + API 客户端

**Files:**
- Create: `lib/types.ts`
- Create: `lib/api.ts`
- Modify: `.env.local`

- [ ] **Step 1: 安装新依赖**

```bash
cd "D:\Desktop\_My\nextjs-study\nexacloud"
npm install react-markdown remark-gfm rehype-shiki @shikijs/rehype shiki
npm install @giscus/react
```

- [ ] **Step 2: 创建 .env.local（如不存在）**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
REVALIDATE_SECRET=your-revalidate-secret
NEXT_PUBLIC_GISCUS_REPO=your-username/your-blog-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

- [ ] **Step 3: 创建 lib/types.ts**

```typescript
// lib/types.ts
export interface Author {
  name: string;
  avatar: string | null;
  bio?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  readingTime: number;
  views: number;
  author: Author;
  category: Category;
  tags: { tag: Tag }[];
  createdAt: string;
  updatedAt: string;
}

export interface PostSummary extends Omit<Post, 'content'> {}

export interface PaginatedPosts {
  posts: PostSummary[];
  total: number;
  page: number;
  totalPages: number;
}
```

- [ ] **Step 4: 创建 lib/api.ts**

```typescript
// lib/api.ts
import type { Post, PostSummary, PaginatedPosts, Category, Tag } from './types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  posts: {
    list: (params?: { page?: number; limit?: number; category?: string; tag?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.category) q.set('category', params.category);
      if (params?.tag) q.set('tag', params.tag);
      if (params?.search) q.set('search', params.search);
      return apiFetch<PaginatedPosts>(`/posts?${q}`, { next: { revalidate: 3600 } });
    },
    featured: () =>
      apiFetch<PostSummary[]>('/posts/featured', { next: { revalidate: 3600 } }),
    bySlug: (slug: string) =>
      apiFetch<Post>(`/posts/${slug}`, { next: { revalidate: 3600, tags: [`post-${slug}`] } }),
    slugs: () =>
      apiFetch<{ slug: string }[]>('/posts/slugs', { cache: 'force-cache' }),
  },
  categories: {
    list: () => apiFetch<Category[]>('/categories', { next: { revalidate: 86400 } }),
  },
  tags: {
    list: () => apiFetch<Tag[]>('/tags', { next: { revalidate: 86400 } }),
  },
};
```

- [ ] **Step 5: Commit**

```bash
git add lib/ .env.local
git commit -m "feat: add API client and shared types for NestJS integration"
```

---

### Task 8: 清理 NexaCloud 内容 + 重建路由结构

**Files:**
- Delete: `app/(marketing)/` 整个目录
- Delete: `content/blog/` MDX 文章
- Delete: `lib/mdx.ts`
- Delete: `components/home/`, `components/features/`, `components/pricing/`
- Create: `app/(blog)/layout.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: 删除旧内容**

```bash
# 在 nexacloud 目录执行
Remove-Item -Recurse -Force "app/(marketing)"
Remove-Item -Recurse -Force "content"
Remove-Item -Force "lib/mdx.ts"
Remove-Item -Recurse -Force "components/home"
Remove-Item -Recurse -Force "components/features"
Remove-Item -Recurse -Force "components/pricing"
Remove-Item -Recurse -Force "types"
```

- [ ] **Step 2: 创建新目录结构**

```bash
New-Item -ItemType Directory "app/(blog)"
New-Item -ItemType Directory "app/(blog)/posts"
New-Item -ItemType Directory "app/(blog)/posts/[slug]"
New-Item -ItemType Directory "app/(blog)/categories/[slug]"
New-Item -ItemType Directory "app/(blog)/tags/[slug]"
New-Item -ItemType Directory "app/(blog)/about"
New-Item -ItemType Directory "app/admin/posts/new"
New-Item -ItemType Directory "app/admin/login"
New-Item -ItemType Directory "components/blog"
New-Item -ItemType Directory "components/home"
New-Item -ItemType Directory "components/admin"
```

- [ ] **Step 3: 创建 (blog)/layout.tsx（暂用骨架）**

```typescript
// app/(blog)/layout.tsx
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: 更新 Navbar 链接**

```typescript
// components/layout/Navbar.tsx
const links = [
  { href: '/posts', label: 'Posts' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
];
```

- [ ] **Step 5: 确认构建不报错**

```bash
npm run build
```

Expected: 编译警告可能有缺页面，只要不崩溃。（后续步骤补全页面）

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "refactor: remove NexaCloud content, set up blog route structure"
```

---

### Task 9: 首页（个人 Hero + 精选文章）

**Files:**
- Create: `app/(blog)/page.tsx`
- Create: `components/home/PersonalHero.tsx`
- Create: `components/home/PersonalHero.module.css`
- Create: `components/home/FeaturedPosts.tsx`
- Create: `components/home/FeaturedPosts.module.css`
- Create: `components/blog/PostCard.tsx`
- Create: `components/blog/PostCard.module.css`

- [ ] **Step 1: 创建 PostCard 组件**

```typescript
// components/blog/PostCard.tsx
import Link from 'next/link';
import type { PostSummary } from '@/lib/types';
import styles from './PostCard.module.css';

export default function PostCard({ post }: { post: PostSummary }) {
  const tags = post.tags.map((t) => t.tag);
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Link href={`/posts/${post.slug}`} className={styles.card}>
      <div className={styles.cover}>
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className={styles.coverImg} />
        ) : (
          <div className={styles.coverPlaceholder}>
            <span className={styles.category}>{post.category.name}</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.categoryTag}>{post.category.name}</span>
          <span>{post.readingTime} min read</span>
          <span>{date}</span>
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.tags}>
          {tags.slice(0, 3).map((tag) => (
            <span key={tag.slug} className={styles.tag}>#{tag.name}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 创建 PostCard.module.css**

```css
/* components/blog/PostCard.module.css */
.card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

.card:hover {
  border-color: rgba(37, 99, 235, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}

.cover {
  height: 220px;
  overflow: hidden;
}

.coverImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.card:hover .coverImg {
  transform: scale(1.04);
}

.coverPlaceholder {
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.body {
  padding: 24px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.categoryTag {
  background: rgba(37, 99, 235, 0.15);
  color: #93c5fd;
  border: 1px solid rgba(37, 99, 235, 0.25);
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}

.title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 10px;
  color: var(--color-text);
  transition: color 0.2s;
}

.card:hover .title {
  color: var(--color-secondary);
}

.excerpt {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  color: var(--color-text-faint);
}
```

- [ ] **Step 3: 创建 PersonalHero.tsx**

```typescript
// components/home/PersonalHero.tsx
import Link from 'next/link';
import styles from './PersonalHero.module.css';

export default function PersonalHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.avatar}>👨‍💻</div>
        <div className={styles.badge}>Welcome to my blog</div>
        <h1 className={styles.title}>
          Hi, I'm <span className="gradient-text">Your Name</span>
        </h1>
        <p className={styles.bio}>
          Full-stack developer passionate about Next.js, NestJS, and building
          things that matter. I write about web development, architecture, and
          lessons learned the hard way.
        </p>
        <div className={styles.actions}>
          <Link href="/posts" className={styles.btnPrimary}>Read Articles</Link>
          <Link href="/about" className={styles.btnSecondary}>About Me →</Link>
        </div>
        <div className={styles.socials}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 创建 PersonalHero.module.css**

```css
/* components/home/PersonalHero.module.css */
.hero {
  padding: 100px 24px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%);
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.inner {
  position: relative;
  max-width: 680px;
  margin: 0 auto;
}

.avatar {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
}

.badge {
  display: inline-block;
  background: rgba(37, 99, 235, 0.15);
  color: #93c5fd;
  border: 1px solid rgba(37, 99, 235, 0.3);
  padding: 5px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
}

.title {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 20px;
}

.bio {
  font-size: 18px;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 36px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.btnPrimary {
  background: var(--gradient-primary);
  color: #fff;
  padding: 14px 32px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);
  transition: opacity 0.2s, transform 0.2s;
}

.btnPrimary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btnSecondary {
  color: var(--color-text-muted);
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  transition: color 0.2s;
}

.btnSecondary:hover {
  color: var(--color-text);
}

.socials {
  display: flex;
  gap: 24px;
  justify-content: center;
  font-size: 14px;
  color: var(--color-text-faint);
}

.socials a:hover {
  color: var(--color-secondary);
}
```

- [ ] **Step 5: 创建首页**

```typescript
// app/(blog)/page.tsx
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import PersonalHero from '@/components/home/PersonalHero';
import PostCard from '@/components/blog/PostCard';

export const metadata: Metadata = {
  title: { absolute: 'Your Name — Blog' },
  description: 'Writing about Next.js, NestJS, and full-stack development.',
};

export const revalidate = 3600;

export default async function HomePage() {
  const featured = await api.posts.featured();

  return (
    <>
      <PersonalHero />
      {featured.length > 0 && (
        <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px 96px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>
            Featured Articles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {featured.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      )}
    </>
  );
}
```

- [ ] **Step 6: 验证**

确保 NestJS 后端运行中，然后 `npm run dev`，访问 `http://localhost:3000`。

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add personal hero home page with featured posts from API"
```

---

### Task 10: 文章列表页

**Files:**
- Create: `app/(blog)/posts/page.tsx`

- [ ] **Step 1: 创建文章列表页**

```typescript
// app/(blog)/posts/page.tsx
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import PostCard from '@/components/blog/PostCard';

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all articles on web development, Next.js, NestJS, and more.',
};

export const revalidate = 3600;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { posts, total, totalPages } = await api.posts.list({
    page,
    limit: 9,
    category: params.category,
    tag: params.tag,
    search: params.search,
  });

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 className="section-title">
          All <span className="gradient-text">Articles</span>
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '17px' }}>
          {total} articles published
        </p>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '80px 0' }}>
          No posts found.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {posts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/posts?page=${p}`}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: p === page ? 'var(--gradient-primary)' : 'var(--color-surface)',
                color: p === page ? '#fff' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add posts listing page with pagination"
```

---

### Task 11: 文章详情页（Markdown + Shiki + Giscus）

**Files:**
- Create: `app/(blog)/posts/[slug]/page.tsx`
- Create: `components/blog/ReadingProgress.tsx`
- Create: `components/blog/GiscusComments.tsx`
- Create: `components/blog/TableOfContents.tsx`
- Create: `components/blog/MarkdownRenderer.tsx`
- Create: `components/blog/MarkdownRenderer.module.css`

- [ ] **Step 1: ReadingProgress（Client Component）**

```typescript
// components/blog/ReadingProgress.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--color-border)',
        zIndex: 200,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--gradient-primary)',
          transition: 'width 0.1s',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: GiscusComments（Client Component）**

```typescript
// components/blog/GiscusComments.tsx
'use client';

import Giscus from '@giscus/react';

export default function GiscusComments({ slug }: { slug: string }) {
  return (
    <Giscus
      repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''}
      category="General"
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''}
      mapping="specific"
      term={slug}
      theme="dark"
      lang="zh-CN"
    />
  );
}
```

- [ ] **Step 3: MarkdownRenderer（Server Component + Shiki）**

```typescript
// components/blog/MarkdownRenderer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { rehypeShiki } from '@shikijs/rehype';
import styles from './MarkdownRenderer.module.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className={styles.prose}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeShiki, { theme: 'github-dark' }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 4: MarkdownRenderer.module.css**

```css
/* components/blog/MarkdownRenderer.module.css */
.prose {
  color: var(--color-text-muted);
  line-height: 1.9;
  font-size: 17px;
  max-width: 720px;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  color: var(--color-text);
  font-weight: 800;
  margin-top: 56px;
  margin-bottom: 16px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.prose h1 { font-size: 40px; }
.prose h2 { font-size: 30px; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; }
.prose h3 { font-size: 22px; }

.prose p { margin-bottom: 24px; }

.prose a {
  color: var(--color-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose ul, .prose ol {
  padding-left: 28px;
  margin-bottom: 24px;
}

.prose li { margin-bottom: 8px; line-height: 1.8; }

.prose blockquote {
  border-left: 4px solid var(--color-primary);
  padding: 12px 24px;
  color: var(--color-text-muted);
  font-style: italic;
  background: rgba(37, 99, 235, 0.05);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: 24px;
}

.prose pre {
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.7;
  border: 1px solid rgba(37, 99, 235, 0.15);
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: rgba(37, 99, 235, 0.12);
  color: #93c5fd;
  padding: 2px 6px;
  border-radius: 4px;
}

.prose pre code {
  background: none;
  color: inherit;
  padding: 0;
}

.prose img {
  border-radius: var(--radius-md);
  margin: 32px 0;
  width: 100%;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  font-size: 14px;
}

.prose th {
  padding: 12px 16px;
  border-bottom: 2px solid var(--color-border);
  text-align: left;
  font-weight: 700;
  color: var(--color-text);
}

.prose td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.prose hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 48px 0;
}
```

- [ ] **Step 5: 创建文章详情页**

```typescript
// app/(blog)/posts/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import ReadingProgress from '@/components/blog/ReadingProgress';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import GiscusComments from '@/components/blog/GiscusComments';

export async function generateStaticParams() {
  const slugs = await api.posts.slugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await api.posts.bySlug(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: { title: post.title, description: post.excerpt, images: post.coverImage ? [post.coverImage] : [] },
    };
  } catch {
    return { title: 'Post not found' };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await api.posts.bySlug(slug);
  } catch {
    notFound();
  }

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <ReadingProgress />
      <article style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 96px' }}>
        {/* Header */}
        <header style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(37,99,235,0.15)', color: '#93c5fd',
              border: '1px solid rgba(37,99,235,0.25)', padding: '3px 12px',
              borderRadius: '100px', fontSize: '12px', fontWeight: 600,
            }}>
              {post.category.name}
            </span>
            {post.tags.map(({ tag }) => (
              <span key={tag.slug} style={{ fontSize: '13px', color: 'var(--color-text-faint)' }}>
                #{tag.name}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            <span>·</span>
            <span>{post.views} views</span>
          </div>
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', borderRadius: '16px', marginBottom: '48px', aspectRatio: '16/9', objectFit: 'cover' }}
          />
        )}

        {/* Content */}
        <MarkdownRenderer content={post.content} />

        {/* Author bio */}
        <div style={{
          marginTop: '64px', padding: '32px', borderRadius: '16px',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Written by</p>
          <p style={{ fontWeight: 700, marginBottom: '8px' }}>{post.author.name}</p>
          {post.author.bio && (
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{post.author.bio}</p>
          )}
        </div>

        {/* Comments */}
        <div style={{ marginTop: '64px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '32px' }}>Comments</h2>
          <GiscusComments slug={post.slug} />
        </div>
      </article>
    </>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add post detail page with Shiki code highlighting and Giscus comments"
```

---

### Task 12: ISR Revalidation Webhook

**Files:**
- Create: `app/api/revalidate/route.ts`

- [ ] **Step 1: 创建 revalidate webhook**

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const { slug } = await request.json();

  if (slug) {
    revalidateTag(`post-${slug}`);
  }
  revalidatePath('/posts');
  revalidatePath('/');

  return NextResponse.json({ revalidated: true });
}
```

后端发布文章时调用：`POST /api/revalidate?secret=xxx` `{ slug: "post-slug" }`

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add ISR revalidation webhook"
```

---

### Task 13: About 页面

**Files:**
- Create: `app/(blog)/about/page.tsx`

- [ ] **Step 1: 创建 About 页面**

```typescript
// app/(blog)/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about me and what I write about.',
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 96px' }}>
      <h1 className="section-title">About <span className="gradient-text">Me</span></h1>

      <div style={{
        marginTop: '48px', padding: '40px',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '16px',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>👨‍💻</div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>Your Name</h2>
        <p style={{ fontSize: '17px', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '24px' }}>
          Full-stack developer based in China. I build web applications with Next.js,
          NestJS, and TypeScript. This blog is where I share what I learn.
        </p>
        <p style={{ fontSize: '17px', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
          When I'm not coding, I'm exploring open-source projects and contributing
          to the developer community.
        </p>
      </div>

      <div style={{ marginTop: '48px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Tech Stack</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'React', 'Docker', 'Vercel'].map((tech) => (
            <span key={tech} style={{
              background: 'rgba(37,99,235,0.12)', color: '#93c5fd',
              border: '1px solid rgba(37,99,235,0.2)', padding: '6px 16px',
              borderRadius: '100px', fontSize: '14px', fontWeight: 600,
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '48px', display: 'flex', gap: '16px' }}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          style={{
            background: 'var(--gradient-primary)', color: '#fff',
            padding: '12px 28px', borderRadius: 'var(--radius-sm)',
            fontWeight: 700, fontSize: '15px',
          }}>
          GitHub →
        </a>
        <a href="mailto:your@email.com"
          style={{
            background: 'var(--color-surface)', color: 'var(--color-text)',
            border: '1px solid var(--color-border)', padding: '12px 28px',
            borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '15px',
          }}>
          Email Me
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add about page"
```

---

### Task 14: Admin 登录 + 文章管理（基础版）

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Admin Login 页**

```typescript
// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (!res.ok) { setError('Invalid credentials'); return; }
    const data = await res.json();
    localStorage.setItem('admin_token', data.access_token);
    router.push('/admin');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Admin Login</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', fontSize: '14px' }}>
          Default: admin@blog.com / admin123
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input name="email" type="email" placeholder="Email" required
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', padding: '12px 16px', fontSize: '15px' }} />
          <input name="password" type="password" placeholder="Password" required
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', padding: '12px 16px', fontSize: '15px' }} />
          {error && <p style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Admin Layout（检查 token）**

```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <nav style={{
        padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)',
        background: 'rgba(6,13,31,0.9)',
      }}>
        <span style={{ fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Blog Admin
        </span>
        <a href="/" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>← View Site</a>
      </nav>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Admin 文章列表页（Client）**

```typescript
// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostSummary } from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setPosts(d.posts));
  }, [router]);

  async function deletePost(id: number) {
    if (!confirm('Delete this post?')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Posts ({posts.length})</h1>
        <a href="/admin/posts/new"
          style={{ background: 'var(--gradient-primary)', color: '#fff', padding: '10px 22px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>
          + New Post
        </a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {posts.map((post) => (
          <div key={post.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px',
          }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>{post.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {post.published ? '✅ Published' : '⏳ Draft'} · {post.category.name} · {post.views} views
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={`/admin/posts/${post.id}/edit`}
                style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                Edit
              </a>
              <button onClick={() => deletePost(post.id)}
                style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add admin login and post management dashboard"
```

---

## 自检清单

| 需求 | 对应任务 |
|------|---------|
| NestJS CRUD API | Task 4 |
| JWT 鉴权 | Task 3 |
| Prisma + PostgreSQL | Task 2 |
| 分类/标签 | Task 5 |
| Seed 数据 | Task 6 |
| API 客户端 | Task 7 |
| 个人博客首页 | Task 9 |
| 文章列表（ISR） | Task 10 |
| 文章详情（SSG + Shiki） | Task 11 |
| Giscus 评论 | Task 11 |
| 阅读进度条 | Task 11 |
| ISR Revalidation | Task 12 |
| About 页面 | Task 13 |
| Admin 后台 | Task 14 |

## API 端点汇总

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | /api/auth/login | - | 登录获取 token |
| GET | /api/posts | - | 文章列表（分页/搜索） |
| GET | /api/posts/featured | - | 精选文章 |
| GET | /api/posts/slugs | - | 所有 slug（generateStaticParams） |
| GET | /api/posts/:slug | - | 文章详情（+浏览量+1） |
| POST | /api/posts | JWT | 创建文章 |
| PUT | /api/posts/:id | JWT | 更新文章 |
| DELETE | /api/posts/:id | JWT | 删除文章 |
| GET | /api/categories | - | 分类列表 |
| POST | /api/categories | JWT | 创建分类 |
| GET | /api/tags | - | 标签列表 |
| POST | /api/tags | JWT | 创建标签 |
