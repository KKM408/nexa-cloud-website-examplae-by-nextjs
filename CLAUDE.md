# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

Two sub-projects in a monorepo (no shared build tooling between them):

```
nextjs-study/
  blog-api/     # NestJS 11 backend — REST API + Prisma ORM
  nexacloud/    # Next.js 16 frontend — App Router
  docs/         # Notes and references (not code)
```

## blog-api (NestJS backend)

### Dev Commands
```bash
cd blog-api
npm run start:dev      # watch mode on port 3001
npm run build          # compile to dist/
npm run test           # jest unit tests
npm run test:e2e       # jest e2e (test/jest-e2e.json)
```

### Database
- PostgreSQL via Prisma. Schema is split across `prisma/schema/*.prisma` (requires `previewFeatures = ["prismaSchemaFolder"]`).
- Default connection: `postgresql://blog:blog123@localhost:5432/blog_db` (see `blog-api/.env`).
- After schema changes: `npx prisma migrate dev --name <name>`
- Seed data: `npx prisma db seed` (runs `prisma/seed.ts`)
- Prisma client regen: `npx prisma generate`

### Architecture
- Global prefix: `/api`
- Global `ValidationPipe({ whitelist: true, transform: true })` — extra DTO fields are stripped silently.
- No custom exception filter — unhandled non-HttpException errors become default `500 Internal Server Error`. Always catch `Prisma.PrismaClientKnownRequestError` in service methods and rethrow as `ConflictException` (P2002) or `BadRequestException` (P2003).
- Modules: `AuthModule`, `PostsModule`, `CategoriesModule`, `TagsModule`.
- Auth: JWT Bearer token. `JwtStrategy.validate` returns `{ id: payload.sub, email }` — use `req.user.id` (not `req.user.sub`) in controllers.

### Key Prisma error codes
| Code | Meaning | Throw |
|------|---------|-------|
| P2002 | Unique constraint (e.g. slug) | `ConflictException` |
| P2003 | Foreign key constraint | `BadRequestException` |

## nexacloud (Next.js frontend)

### Dev Commands
```bash
cd nexacloud
npm run dev    # starts on port 3000
npm run build
npm run lint
```

### Environment
`nexacloud/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
REVALIDATE_SECRET=dev-revalidate-secret
```

### Architecture
- Route groups: `(blog)` for public blog pages, `(editor)` for the markdown write page.
- **API proxy pattern**: All backend calls from the browser go through `nexacloud/app/api/admin/**` route handlers, which attach the `blog_token` httpOnly cookie as `Authorization: Bearer` before forwarding to `blog-api`.
- Auth flow: `POST /api/admin/login` → backend returns `access_token` → stored as `blog_token` httpOnly cookie (7d) → proxy routes read it and forward to NestJS.
- Markdown editor: `components/editor/MarkdownEditor` (ByteMD-based), loaded with `dynamic(..., { ssr: false })`.
- The editor page (`(editor)/write/page.tsx`) submits to `/api/admin/posts` which proxies to NestJS `POST /api/posts`.

### Post creation payload (must match `CreatePostDto`)
```ts
{ title, slug, excerpt, content, categoryId, published, featured, tagIds? }
```
`categoryId` must reference an existing Category row — seed the DB if 404/400 on publish.
