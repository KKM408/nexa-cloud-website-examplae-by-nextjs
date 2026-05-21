# Blog API

NestJS + PostgreSQL + Prisma 博客后端服务。

## 技术栈

- **NestJS** — 后端框架
- **Prisma 5** — ORM（多文件 schema）
- **PostgreSQL 16** — 数据库（Docker 运行）
- **JWT + Passport** — 认证
- **bcryptjs** — 密码加密

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制并按需修改：

```bash
cp .env.example .env
```

`.env` 默认值：

```env
# 数据库
DATABASE_URL="postgresql://blog:blog123@localhost:5432/blog_db"

# JWT 认证（生产环境替换为强密钥）
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# 服务端口
PORT=9872
```

### 3. 启动数据库

```bash
docker compose up -d
```

> **中国网络**：Docker Hub 可能被墙，先从镜像拉取再打 tag：
> ```bash
> docker pull docker.m.daocloud.io/library/postgres:16-alpine
> docker tag docker.m.daocloud.io/library/postgres:16-alpine postgres:16-alpine
> docker compose up -d
> ```

### 4. 执行数据库迁移

```bash
npx prisma migrate deploy
```

### 5. 写入种子数据（可选）

```bash
npx prisma db seed
```

种子数据包含：
- 管理员账号：`admin@blog.com` / `admin123`
- 示例分类、标签、文章各一条

### 6. 启动服务

```bash
# 开发模式（热更新）
npm run start:dev

# 生产模式
npm run start:prod
```

服务运行在 `http://localhost:9872`，API 前缀为 `/api`。

---

## Docker 操作

```bash
# 启动容器（后台）
docker compose up -d

# 查看状态
docker compose ps

# 停止（数据保留）
docker compose stop

# 停止并删除容器（数据保留在 volume）
docker compose down

# 停止并删除容器 + 数据（慎用）
docker compose down -v

# 进入容器执行 psql
docker exec -it blog-api-postgres-1 psql -U blog -d blog_db
```

### TablePlus 连接参数

| 字段 | 值 |
|------|-----|
| Host | `127.0.0.1` |
| Port | `5432` |
| User | `blog` |
| Password | `blog123` |
| Database | `blog_db` |

---

## Prisma 操作

```bash
# 验证 schema
npx prisma validate

# 开发时修改 schema 后（生成迁移文件 + 应用）
npx prisma migrate dev --name "描述变更内容"

# 生产部署（只应用已有迁移，不生成新文件）
npx prisma migrate deploy

# 重新生成客户端类型
npx prisma generate

# 写入种子数据
npx prisma db seed

# 可视化数据浏览器
npx prisma studio
```

### Schema 文件结构

```
prisma/
├── migrations/          # 自动生成的 SQL 迁移文件
├── seed.ts              # 种子数据脚本
└── schema/              # 多文件 schema（Prisma 5.15+）
    ├── base.prisma      # generator + datasource
    ├── user.prisma      # User model
    ├── post.prisma      # Post + PostTag models
    ├── category.prisma  # Category model
    └── tag.prisma       # Tag model
```

### 日常开发循环

```
修改 schema → migrate dev → generate → 重启服务
```

---

## API 端点

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 登录，返回 JWT | — |
| GET | `/api/posts` | 文章列表（分页/筛选） | — |
| GET | `/api/posts/:slug` | 文章详情（+浏览量+1） | — |
| GET | `/api/posts/featured` | 精选文章 | — |
| POST | `/api/posts` | 创建文章 | JWT |
| PUT | `/api/posts/:id` | 更新文章 | JWT |
| DELETE | `/api/posts/:id` | 删除文章 | JWT |
| GET | `/api/categories` | 分类列表 | — |
| GET | `/api/tags` | 标签列表 | — |
