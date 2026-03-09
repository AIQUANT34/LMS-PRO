import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class SubmitAssessmentDto {

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  textAnswer?: string;
}

export class ReviewSubmissionDto {

  @IsNumber()
  @Min(0)
  score: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}