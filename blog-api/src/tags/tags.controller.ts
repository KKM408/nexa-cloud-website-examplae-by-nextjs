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
