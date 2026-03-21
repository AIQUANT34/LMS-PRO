import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from './schemas/certificate.schema';
import { Course, CourseSchema } from 'src/courses/schemas/course.schema';
import { BlockchainModule } from 'src/blockchain/blockchain.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    BlockchainModule,
  ],

  providers: [CertificatesService],
  controllers: [CertificatesController],
  exports: [CertificatesService],
})
export class CertificatesModule {}
