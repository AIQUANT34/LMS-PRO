import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Certificate,
  CertificateDocument,
} from './schemas/certificate.schema';

import * as QRCode from 'qrcode'
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

import * as crypto from 'crypto'
import { BlockchainService } from 'src/blockchain/blockchain.service';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,

    private blockchainService: BlockchainService,
  ) {}

  async generateCertificate(data: {
    userId: string;
    courseId: string;
    studentName: string;
    courseName: string;
    InstructorName: string;
  }) {
    const certificateReference = this.generateCertificateReference();
    //instead of hard code use env var
    // const verifyUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;
    const verifyUrl = `${process.env.BACKEND_URL}/certificates/verify/${certificateReference}`;
    const qrBase64 = await QRCode.toDataURL(verifyUrl);

    const outputDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(
      outputDir,
      `${certificateReference}.pdf`,
    );

    //Load HTML template
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'certificate.template.html',
    );

    let html = fs.readFileSync(templatePath, 'utf-8');

    const date = new Date().toDateString();

    //Replace dynamic values
    html = html
      .replace('{{studentName}}', data.studentName)
      .replace('{{courseName}}', data.courseName)
      .replace('{{instructorName}}', data.InstructorName)
      .replace('{{date}}', date)
      .replace('{{certificateReference}}', certificateReference);
      
    html = html.replace(
  '</body>',
  `<img src="${qrBase64}" class="qr-code" /></body>`
    ); 
    
    
    //Convert background image to Base64
    const imagePath = path.join(
      process.cwd(),
      'templates',
      'certificate-template.png',
    );

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    //Inject background directly into HTML
    html = html.replace(
      '</head>',
      `<style>
        .certificate {
          width: 1123px;
          height: 794px;
          background: url("data:image/png;base64,${base64Image}") no-repeat center;
          background-size: cover;
          position: relative;
          font-family: 'Georgia', serif;
        }

    .qr-code {
      position: absolute;
      right: 120px;
      bottom: 80px;
      width: 120px;
      height: 120px;
    }

      </style>
      </head>`
    );

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Load only positioning CSS (NO background inside CSS file)
    await page.addStyleTag({
      path: path.join(
        process.cwd(),
        'templates',
        'certificate.css',
      ),
    });

    // Generate PDF
    await page.pdf({
      path: outputPath,
      width: '1123px',
      height: '794px',
      printBackground: true,
    });

    await browser.close();

    // Save in DB
    const certificate = await this.certificateModel.create({
      certificateReference,
      userId: data.userId,
      courseId: data.courseId,
      studentName: data.studentName,
      courseName: data.courseName,
      InstructorName: data.InstructorName,
      completionDate: new Date(),
      certificateUrl: `/certificates/${certificateReference}.pdf`,
    });

    return {
      certificateReference,
      certificateUrl: `/certificates/${certificateReference}.pdf`,
    }
  }

  private generateCertificateReference(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CERT-${new Date().getFullYear()}-${random}`;
}

  async approveCertificate(certificateId: string) {
  const certificate = await this.certificateModel.findById(certificateId);

  if (!certificate) {
    throw new Error('Certificate not found');
  }

  if (certificate.isApproved) {
    return { message: 'Certificate already approved' };
  }

 
  // Create completion record (NO personal sensitive data)
const completionRecord = {
  certificateReference: certificate.certificateReference,
  courseId: certificate.courseId.toString(),
  completionDate: certificate.completionDate,
};

// Generate SHA256 hash
const hash = crypto
  .createHash('sha256')
  .update(JSON.stringify(completionRecord))
  .digest('hex');

  certificate.isApproved = true;
  certificate.completionHash = hash;

  // Submit hash to blockchain (Cardano testnet simulation)
  const txId = await this.blockchainService.submitHashToCardano(hash);
  
  certificate.blockchainTxId = txId;

  await certificate.save();

  return {
    message: 'Certificate approved successfully',
    certificateReference: certificate.certificateReference,
  };
}



  async verifyCertificate(reference: string){
    const certificate = await this.certificateModel.findOne({
      certificateReference: reference,
    })

    if(!certificate) {
      throw new Error('ceritficate not found')
    }

    return {
      certificateReference: certificate.certificateReference,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      completionDate: certificate.completionDate,
      isApproved: certificate.isApproved,
      blockchainTxId: certificate.blockchainTxId,
    }
  }

}