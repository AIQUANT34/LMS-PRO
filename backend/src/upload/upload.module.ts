import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AwsS3Service } from './aws-s3.service';
// import { S3UploadController } from './s3-upload.controller';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadController], // Temporarily disable S3UploadController
  providers: [UploadService, AwsS3Service],
  exports: [UploadService, AwsS3Service],
})
export class UploadModule {}
