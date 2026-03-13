import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsObject, Min, Max } from 'class-validator';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  videoDuration?: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  resourceFiles?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsString()
  courseId: string;

  @IsOptional()
  @IsObject()
  videoMetadata?: {
    duration: number;
    format: string;
    size: number;
    resolution: string;
    bitrate?: number;
  };

  @IsOptional()
  @IsArray()
  subtitles?: Array<{
    language: string;
    url: string;
    format: string;
  }>;

  @IsOptional()
  @IsArray()
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    timestamp?: number;
  }>;
}

export class UpdateLectureDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  videoDuration?: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  resourceFiles?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsObject()
  videoMetadata?: {
    duration: number;
    format: string;
    size: number;
    resolution: string;
    bitrate?: number;
  };

  @IsOptional()
  @IsObject()
  metrics?: {
    views: number;
    completionRate: number;
    averageWatchTime: number;
  };

  @IsOptional()
  @IsArray()
  subtitles?: Array<{
    language: string;
    url: string;
    format: string;
  }>;

  @IsOptional()
  @IsArray()
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    timestamp?: number;
  }>;
}

export class ReorderLecturesDto {
  @IsArray()
  lectureOrders: Array<{
    id: string;
    order: number;
  }>;
}

export class AddResourceFileDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  size: number;
}

export class UpdateMetricsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  views?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  averageWatchTime?: number;
}
