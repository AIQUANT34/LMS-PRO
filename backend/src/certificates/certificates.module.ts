import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from './schemas/certificate.schema';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema},

    ]),
  ],


  providers: [CertificatesService],
  controllers: [CertificatesController],
  exports: [CertificatesService],
})
export class CertificatesModule {}
