import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsDate,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  courseId: string;

  @IsDate()
  dueDate: Date;

  @IsNumber()
  points: number;

  @IsString()
  type: string;

  @IsArray()
  @IsOptional()
  attachments?: Array<{
    name: string;
    url: string;
  }>;
}

export class SubmitAssignmentDto {
  @IsString()
  assignmentId: string;

  @IsString()
  courseId: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsOptional()
  file?: any;
}
