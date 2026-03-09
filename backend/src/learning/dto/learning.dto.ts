import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, Max } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  moduleId: string;

  @IsString()
  type: 'video' | 'text' | 'quiz';

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  videoDuration?: number;

  @IsOptional()
  @IsString()
  transcription?: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsOptional()
  @IsArray()
  resources?: { title: string; url: string }[];
}

export class UpdateProgressDto {
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentTime?: number;

  @IsOptional()
  @IsNumber()
  videoDuration?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  watchedPercentage?: number;

  @IsOptional()
  @IsNumber()
  timeSpentSeconds?: number;
}

export class UpdateVideoPlaybackDto {
  @IsNumber()
  @Min(0)
  currentTime: number;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsString()
  quality?: string;

  @IsOptional()
  @IsBoolean()
  isSubtitlesEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  watchRate?: number;
}

export class CompleteQuizDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsOptional()
  @IsNumber()
  attempts?: number;

  @IsBoolean()
  @IsOptional()
  isPassed?: boolean;
}

export class EnrollCourseDto {
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;
}
