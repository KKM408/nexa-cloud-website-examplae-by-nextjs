import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    category?: string;
    tag?: string;
    search?: string;
  }) {
    const { page, pageSize, category, tag, search } = params;
    const paginated = page !== undefined && pageSize !== undefined;

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
        ...(paginated && { skip: (page - 1) * pageSize, take: pageSize }),
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, avatar: true } },
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      total,
      ...(paginated && { page, pageSize, totalPages: Math.ceil(total / pageSize) }),
    };
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
        ...(tagIds !== undefined && tagIds.length > 0 && { tags: { create: tagIds.map((tagId) => ({ tagId })) } }),
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
