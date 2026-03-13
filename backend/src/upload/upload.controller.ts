import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, DiskStorageOptions } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { UploadService } from './upload.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('file')
  @UseGuards(JwtGuard) // Re-enabled authentication
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, callback) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 1 // Only 1 file at a time
      } as any,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('Upload request received:', {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        encoding: file.encoding
      });
      
      const result = await this.uploadService.uploadFile(file);

      return {
        success: true,
        message: 'File uploaded successfully',
        url: result.url,
        public_id: result.public_id,
        fileName: result.fileName,
      };
    } catch (error) {
      console.error('Upload controller error:', error);
      return {
        success: false,
        message: 'Upload failed',
        error: error.message,
      };
    }
  }
}
