import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION') || 'us-east-1',
    });
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME') || '';
  }

  // Generate signed upload URL for direct browser upload
  async generateUploadUrl(fileName: string, fileType: string, folder: string = 'uploads') {
    const key = `${folder}/${Date.now()}-${fileName}`;
    
    const s3Params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60, // URL expires in 60 seconds
      ContentType: fileType,
      ACL: 'public-read', // Make files publicly accessible
    };

    try {
      const uploadUrl = await this.s3.getSignedUrlPromise('putObject', s3Params);
      
      // Return the public URL that will be accessible after upload
      const fileUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION') || 'us-east-1'}.amazonaws.com/${key}`;
      
      return {
        uploadUrl,
        fileUrl,
        key,
      };
    } catch (error) {
      throw new Error(`Failed to generate upload URL: ${error.message}`);
    }
  }

  // Generate signed URL for file access (if needed for private files)
  async getFileUrl(key: string): Promise<string> {
    const s3Params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 3600, // URL expires in 1 hour
    };

    try {
      return await this.s3.getSignedUrlPromise('getObject', s3Params);
    } catch (error) {
      throw new Error(`Failed to generate file URL: ${error.message}`);
    }
  }

  // Delete file from S3
  async deleteFile(key: string): Promise<void> {
    const s3Params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      await this.s3.deleteObject(s3Params).promise();
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Get file metadata
  async getFileMetadata(key: string) {
    const s3Params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      return await this.s3.headObject(s3Params).promise();
    } catch (error) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  // Validate file type
  validateFileType(fileType: string, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => fileType.startsWith(type));
  }

  // Get file size limit based on type
  getMaxFileSize(fileType: string): number {
    const sizeLimits = {
      'video/': 500 * 1024 * 1024, // 500MB for videos
      'image/': 10 * 1024 * 1024,   // 10MB for images
      'application/pdf': 50 * 1024 * 1024, // 50MB for PDFs
      'default': 100 * 1024 * 1024, // 100MB default
    };

    for (const [type, limit] of Object.entries(sizeLimits)) {
      if (fileType.startsWith(type)) {
        return limit;
      }
    }
    
    return sizeLimits.default;
  }
}
