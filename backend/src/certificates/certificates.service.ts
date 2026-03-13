import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificate, CertificateDocument } from './schemas/certificate.schema';

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
    try {
      const certificate = await this.certificateModel.findById(certificateId);

      if (!certificate) {
        throw new Error('Certificate not found');
      }

      if (certificate.isApproved) {
        return { message: 'Certificate already approved' };
      }

      // 1️⃣ Generate certificate reference (ONLY AFTER APPROVAL)
      certificate.certificateReference = this.generateCertificateReference();

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
      const txId = await this.blockchainService.submitHashToCardano(hash);

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
        .replace('{{certificateReference}}', certificate.certificateReference);

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
        path: path.join(process.cwd(), 'templates', 'certificate.css'),
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
    } catch (error) {
      console.error('Approval Error:', error);
      throw new Error('Certificate approval failed. Please try again.');
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
  // GET USER CERTIFICATES
  // ===============================
  async getUserCertificates(userId: string) {
    const certificates = await this.certificateModel
      .find({ userId, isApproved: true })
      .populate('courseId', 'title thumbnail')
      .sort({ createdAt: -1 });

    return certificates.map((cert) => ({
      _id: cert._id,
      certificateId: cert.certificateReference,
      employeeName: cert.studentName,
      programName: (cert.courseId as any)?.title || cert.courseName,
      trainerName: cert.InstructorName,
      completionDate: cert.completionDate,
      grade: 'A',
      score: 95,
      certificateUrl: cert.certificateUrl,
      verificationUrl: `https://preview.cardanoscan.io/transaction/${cert.blockchainTxId}`,
      blockchainTxId: cert.blockchainTxId,
      blockchainNetwork: 'Cardano Testnet',
      achievements: ['Completed all modules', 'Excellent performance'],
      issueDate: (cert as any).createdAt || cert.completionDate,
      thumbnail: (cert.courseId as any)?.thumbnail,
    }));
  }

  // ===============================
  // GET CERTIFICATE BY ID
  // ===============================
  async getCertificateById(id: string) {
    const certificate = await this.certificateModel
      .findById(id)
      .populate('courseId', 'title thumbnail')
      .populate('userId', 'name email');

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return {
      _id: certificate._id,
      certificateId: certificate.certificateReference,
      employeeName: certificate.studentName,
      programName:
        (certificate.courseId as any)?.title || certificate.courseName,
      trainerName: certificate.InstructorName,
      completionDate: certificate.completionDate,
      grade: 'A',
      score: 95,
      certificateUrl: certificate.certificateUrl,
      verificationUrl: `https://preview.cardanoscan.io/transaction/${certificate.blockchainTxId}`,
      blockchainTxId: certificate.blockchainTxId,
      blockchainNetwork: 'Cardano Testnet',
      achievements: ['Completed all modules', 'Excellent performance'],
      issueDate: (certificate as any).createdAt || certificate.completionDate,
      isApproved: certificate.isApproved,
    };
  }

  // ===============================
  // DOWNLOAD CERTIFICATE
  // ===============================
  async downloadCertificate(id: string, res: any) {
    const certificate = await this.certificateModel.findById(id);

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (!certificate.isApproved) {
      throw new Error('Certificate not approved yet');
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="certificate-${certificate.certificateReference}.pdf"`,
    );

    // Read and send the PDF file
    const filePath = path.join(
      process.cwd(),
      'certificates',
      `${certificate.certificateReference}.pdf`,
    );

    if (fs.existsSync(filePath)) {
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      throw new NotFoundException('Certificate file not found');
    }
  }

  // ===============================
  // SHARE CERTIFICATE
  // ===============================
  async shareCertificate(id: string, userId: string, shareData: any) {
    const certificate = await this.certificateModel.findOne({
      _id: id,
      userId,
      isApproved: true,
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found or not authorized');
    }

    // Here you would integrate with actual sharing platforms
    // For now, return a success response with share URLs
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificate.certificateUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I've successfully completed ${certificate.courseName}! ${certificate.certificateUrl}`)}`,
      email: `mailto:?subject=Certificate of Completion&body=${encodeURIComponent(`I've successfully completed ${certificate.courseName}! View my certificate: ${certificate.certificateUrl}`)}`,
    };

    return {
      success: true,
      message: 'Certificate shared successfully',
      shareUrls,
      certificateUrl: certificate.certificateUrl,
    };
  }

  // ===============================
  // GENERATE REFERENCE
  // ===============================
  private generateCertificateReference(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `CERT-${new Date().getFullYear()}-${random}`;
  }
}
