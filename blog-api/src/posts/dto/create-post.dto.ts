import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsInt,
  MinLength,
} from 'class-validator';

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
