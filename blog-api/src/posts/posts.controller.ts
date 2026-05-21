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
