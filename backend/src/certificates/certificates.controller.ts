import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import type { Response } from 'express';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('my')
  @UseGuards(JwtGuard)
  async getMyCertificates(@Req() req) {
    return this.certificatesService.getUserCertificates(req.user.userId);
  }

  @Get(':id')
  async getCertificate(@Param('id') id: string) {
    return this.certificatesService.getCertificateById(id);
  }

  @Get(':id/download')
  async downloadCertificate(@Param('id') id: string, @Res() res: Response) {
    return this.certificatesService.downloadCertificate(id, res);
  }

  @Post(':id/share')
  @UseGuards(JwtGuard)
  async shareCertificate(
    @Param('id') id: string,
    @Req() req,
    @Body() shareData: any,
  ) {
    return this.certificatesService.shareCertificate(
      id,
      req.user.userId,
      shareData,
    );
  }

  @Patch('approve/:id')
  async approveCertificate(@Param('id') id: string) {
    return this.certificatesService.approveCertificate(id);
  }

  @Get('verify/:reference')
  async verifyCertificate(@Param('reference') reference: string) {
    return this.certificatesService.verifyCertificate(reference);
  }
}
