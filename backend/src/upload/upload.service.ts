import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      // For now, use local storage with multer
      // The file is already stored temporarily by multer
      
      // Generate a unique filename
      const fileExt = extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
      
      // Move file to permanent location
      const fs = require('fs').promises;
      const path = require('path');
      
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      
      // Ensure uploads directory exists
      try {
        await fs.mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory already exists, ignore error
      }
      
      // Move file from temp to uploads
      const tempPath = file.path;
      const permanentPath = path.join(uploadsDir, uniqueName);
      
      console.log('Moving file from:', tempPath);
      console.log('Moving file to:', permanentPath);
      
      try {
        await fs.rename(tempPath, permanentPath);
        console.log('File moved successfully');
      } catch (moveError) {
        console.error('Error moving file:', moveError);
        // Try copy as fallback
        await fs.copyFile(tempPath, permanentPath);
        await fs.unlink(tempPath); // Remove temp file after copy
        console.log('File copied successfully as fallback');
      }
      
      // Return the URL that will be accessible
      const fileUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${uniqueName}`;
      
      console.log('File URL generated:', fileUrl);
      
      return {
        url: fileUrl,
        public_id: uniqueName,
        fileName: uniqueName,
      };
    } catch (error) {
      console.error('Upload service error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}
