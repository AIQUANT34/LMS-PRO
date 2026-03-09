import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Certificate,
  CertificateDocument,
} from './schemas/certificate.schema';

import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as crypto from 'crypto';

import { BlockchainService } from 'src/blockchain/blockchain.service';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    private blockchainService: BlockchainService,
  ) {}

  // ===============================
  // STEP 1: CREATE CERTIFICATE (NO PDF, NO BLOCKCHAIN)
  // ===============================
  async generateCertificate(data: {
    userId: string;
    courseId: string;
    studentName: string;
    courseName: string;
    InstructorName: string;
  }) {
    const certificate = await this.certificateModel.create({
      userId: data.userId,
      courseId: data.courseId,
      studentName: data.studentName,
      courseName: data.courseName,
      InstructorName: data.InstructorName,
      completionDate: new Date(),
      isApproved: false,
    });

    return certificate;
  }

  // ===============================
  // STEP 2: APPROVE CERTIFICATE
  // Generate reference + Blockchain + QR + PDF
  // ===============================
  async approveCertificate(certificateId: string) {
   try{
    const certificate = await this.certificateModel.findById(certificateId);

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    if (certificate.isApproved) {
      return { message: 'Certificate already approved' };
    }

    // 1️⃣ Generate certificate reference (ONLY AFTER APPROVAL)
    certificate.certificateReference =
      this.generateCertificateReference();

    // 2️⃣ Create minimal completion record (NO personal data)
    const completionRecord = {
      certificateReference: certificate.certificateReference,
      courseId: certificate.courseId.toString(),
      completionDate: certificate.completionDate,
    };

    // 3️⃣ Generate SHA256 hash
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(completionRecord))
      .digest('hex');

    certificate.completionHash = hash;

    // 4️⃣ Submit hash to Cardano testnet
    const txId =
      await this.blockchainService.submitHashToCardano(hash);

    certificate.blockchainTxId = txId;

    // 5️⃣ Generate QR Code
    const verifyUrl = `${process.env.BACKEND_URL}/certificates/verify/${certificate.certificateReference}`;
    const qrBase64 = await QRCode.toDataURL(verifyUrl);

    // 6️⃣ Generate PDF
    const outputDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(
      outputDir,
      `${certificate.certificateReference}.pdf`,
    );

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'certificate.template.html',
    );

    let html = fs.readFileSync(templatePath, 'utf-8');

    const date = new Date().toDateString();

    html = html
      .replace('{{studentName}}', certificate.studentName)
      .replace('{{courseName}}', certificate.courseName)
      .replace('{{instructorName}}', certificate.InstructorName)
      .replace('{{date}}', date)
      .replace(
        '{{certificateReference}}',
        certificate.certificateReference,
      );

    html = html.replace(
      '</body>',
      `<img src="${qrBase64}" class="qr-code" /></body>`,
    );

    // Inject background image
    const imagePath = path.join(
      process.cwd(),
      'templates',
      'certificate-template.png',
    );

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

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
      </head>`,
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    await page.addStyleTag({
      path: path.join(
        process.cwd(),
        'templates',
        'certificate.css',
      ),
    });

    await page.pdf({
      path: outputPath,
      width: '1123px',
      height: '794px',
      printBackground: true,
    });

    await browser.close();

    // 7️⃣ Save final fields
    certificate.certificateUrl = `/certificates/${certificate.certificateReference}.pdf`;
    certificate.isApproved = true;

    await certificate.save();

    return {
      message: 'Certificate approved successfully',
      certificateReference: certificate.certificateReference,
      blockchainTxId: certificate.blockchainTxId,
      certificateUrl: certificate.certificateUrl,
    };
   }
   catch(error){
    console.error('Approval Error:', error)
    throw new Error('Certificate approval failed. Please try again.')
    }
  }

  
  // VERIFY CERTIFICATE
  
  async verifyCertificate(reference: string) {
  const certificate = await this.certificateModel.findOne({
    certificateReference: reference,
  });

  if (!certificate) {
    throw new NotFoundException('Certificate not found');
  }

  // 1️⃣ Recreate minimal completion record (same structure as approval)
  const completionRecord = {
    certificateReference: certificate.certificateReference,
    courseId: certificate.courseId.toString(),
    completionDate: certificate.completionDate,
  };

  // 2️⃣ Recalculate hash
  const recalculatedHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(completionRecord))
    .digest('hex');

  // 3️⃣ Compare hashes
  const isValid = recalculatedHash === certificate.completionHash;

  return {
    certificateReference: certificate.certificateReference,
    studentName: certificate.studentName,
    courseName: certificate.courseName,
    completionDate: certificate.completionDate,
    isApproved: certificate.isApproved,
    blockchainTxId: certificate.blockchainTxId,
    isValid: isValid,
    blockchainExplorerUrl: `https://preview.cardanoscan.io/transaction/${certificate.blockchainTxId}`,
  };
}

  // ===============================
  // GENERATE REFERENCE
  // ===============================
  private generateCertificateReference(): string {
    const random = Math.floor(
      100000 + Math.random() * 900000,
    );
    return `CERT-${new Date().getFullYear()}-${random}`;
  }
}