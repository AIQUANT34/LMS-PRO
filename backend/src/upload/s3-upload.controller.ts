import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LectureService } from '../courses/lecture.service';
import { CreateLectureDto, UpdateLectureDto, ReorderLecturesDto, AddResourceFileDto, UpdateMetricsDto } from '../courses/dto/lecture.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { AwsS3Service } from './aws-s3.service';

// DTOs
export class GenerateUploadUrlDto {
  fileName: string;
  fileType: string;
  fileSize: number;
  folder?: string;
}

export class DeleteFileDto {
  key: string;
}

export class GetFileMetadataDto {
  key: string;
}

@Controller('s3-upload')
@UseGuards(JwtGuard)
export class S3UploadController {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post('generate-upload-url')
  @HttpCode(HttpStatus.OK)
  async generateUploadUrl(@Body() generateUploadUrlDto: GenerateUploadUrlDto) {
    const { fileName, fileType, folder } = generateUploadUrlDto;

    // Validate file type
    const allowedTypes = [
      'video/',
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!this.awsS3Service.validateFileType(fileType, allowedTypes)) {
      throw new Error('Invalid file type');
    }

    // Check file size limit
    const maxSize = this.awsS3Service.getMaxFileSize(fileType);
    if (generateUploadUrlDto.fileSize > maxSize) {
      throw new Error(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }

    try {
      const result = await this.awsS3Service.generateUploadUrl(fileName, fileType, folder);
      
      return {
        success: true,
        uploadUrl: result.uploadUrl,
        fileUrl: result.fileUrl,
        key: result.key,
        expiresIn: 60, // URL expires in 60 seconds
      };
    } catch (error) {
      throw new Error(`Failed to generate upload URL: ${error.message}`);
    }
  }

  @Post('delete-file')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Body() deleteFileDto: DeleteFileDto) {
    try {
      await this.awsS3Service.deleteFile(deleteFileDto.key);
      
      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  @Post('get-file-metadata')
  @HttpCode(HttpStatus.OK)
  async getFileMetadata(@Body() getFileMetadataDto: GetFileMetadataDto) {
    try {
      const metadata = await this.awsS3Service.getFileMetadata(getFileMetadataDto.key);
      
      return {
        success: true,
        metadata: {
          size: metadata.ContentLength,
          lastModified: metadata.LastModified,
          contentType: metadata.ContentType,
          etag: metadata.ETag,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }
}
