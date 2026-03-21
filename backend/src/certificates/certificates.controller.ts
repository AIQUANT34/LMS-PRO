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
  Query,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator';
import type { Response } from 'express';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('my')
  @UseGuards(JwtGuard)
  async getMyCertificates(@Req() req) {
    return this.certificatesService.getUserCertificates(req.user.userId);
  }

  @Get('pending-approvals')
  @UseGuards(JwtGuard)
  @Roles('trainer', 'admin')
  async getPendingApprovals(@Req() req) {
    return this.certificatesService.getPendingApprovals(req.user.userId);
  }

  @Post('generate')
  @UseGuards(JwtGuard)
  async generateCertificate(@Body() data: any, @Req() req) {
    return this.certificatesService.generateCertificate({
      ...data,
      userId: req.user.userId,
    });
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
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('trainer', 'admin')
  async approveCertificate(@Param('id') id: string, @Req() req) {
    return this.certificatesService.approveCertificate(id, req.user.userId);
  }

  @Post(':id/regenerate')
  @UseGuards(JwtGuard)
  @Roles('trainer', 'admin')
  async regenerateCertificate(@Param('id') id: string) {
    return this.certificatesService.regenerateCertificatePDF(id);
  }

  @Get('verify/:reference')
  async verifyCertificate(@Param('reference') reference: string) {
    return this.certificatesService.verifyCertificate(reference);
  }
}
