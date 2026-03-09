import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { extname } from 'path';
// import { v4 as uuid } from 'uuid';
import cloudinary from './cloudinary.config';


@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  // For now, we'll use local storage
  // In production, integrate with S3/Cloudinary

  // generateFileName(originalName: string): string {
  //   const fileExt = extname(originalName);
  //   return `${uuid()}${fileExt}`;
  // }

  // getFileUrl(fileName: string): string {
  //   // In production, return S3 URL
  //   return `${process.env.BASE_URL}/uploads/${fileName}`;
  // }

    async uploadFile(file: Express.Multer.File) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',  //detects file type automatically
        folder:'lms-uploads',   //stores file inside cloudinary folder
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
      }
    } 

}