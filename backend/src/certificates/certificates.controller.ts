import { Controller, Param, Patch, Get } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {

    constructor(
    private readonly certificatesService: CertificatesService,
    ) {}

    @Patch('approve/:id')
    async approveCertificate(@Param('id') id: string){
        return this.certificatesService.approveCertificate(id)
    }


    @Get('verify/:reference')
    async verifyCertificate(@Param('reference') reference: string){
        return this.certificatesService.verifyCertificate(reference)
    }
}
