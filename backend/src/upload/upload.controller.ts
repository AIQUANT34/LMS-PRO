import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { UploadService } from './upload.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';


@Controller('upload') 
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('file')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination:'./temp',
      filename: (req, file, callback) => { 
        const uniqueName = `${uuid()}${extname(file.originalname)}`
        callback(null, uniqueName)
      }
    })
  }))

  
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadFile(file)

    return {
      message: 'File uploaded successfully',
      url: result.url,
      public_id: result.public_id,
    }
  }
} 