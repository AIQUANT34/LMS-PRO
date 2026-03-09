import { IsString, IsNumber, IsOptional, IsArray, IsObject, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  videoIntro?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsObject()
  curriculum?: any;

  @IsOptional()
  @IsArray()
  assignments?: any[];
}

export class UpdateCourseDto extends CreateCourseDto {
  @IsOptional()
  @IsString()
  status?: string;
}

export class ReviewDecisionDto {
  @IsString()
  decision: 'approve' | 'reject';

  @IsOptional()
  @IsString()
  reason?: string;
}