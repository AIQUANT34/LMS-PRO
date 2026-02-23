import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Certificate,
  CertificateDocument,
} from './schemas/certificate.schema';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as QRCode from 'qrcode';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
  ) {}

  async generateCertificate(data: {
    userId: string;
    courseId: string;
    studentName: string;
    courseName: string;
  }) {
    const certificateId = this.generateCertificateId();

    const templatePath = path.join(
      process.cwd(),
      'assets',
      'certificate-template.png',
    );

    const outputPath = path.join(
      process.cwd(),
      'certificates',
      `${certificateId}.pdf`,
    );

    // Load template image
    const templateBytes = await fs.readFile(templatePath);

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([842, 595]);

    const image = await pdfDoc.embedPng(templateBytes);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: 842,
      height: 595,
    });

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Student Name
    page.drawText(data.studentName, {
      x: 280,
      y: 300,
      size: 36,
      font,
      color: rgb(0.1, 0.2, 0.4),
    });

    // Course Name
    page.drawText(data.courseName, {
      x: 250,
      y: 240,
      size: 24,
      font,
      color: rgb(0.1, 0.2, 0.4),
    });

    // Date
    const date = new Date().toDateString();

    page.drawText(date, {
      x: 360,
      y: 140,
      size: 16,
      font,
    });

    // Certificate ID
    page.drawText(certificateId, {
      x: 600,
      y: 140,
      size: 14,
      font,
    });

    // Generate QR
    const verifyUrl = `https://protrain.com/verify/${certificateId}`;

    const qrImage = await QRCode.toDataURL(verifyUrl);

    const qrImageBytes = Buffer.from(
      qrImage.split(',')[1],
      'base64',
    );

    const qr = await pdfDoc.embedPng(qrImageBytes);

    page.drawImage(qr, {
      x: 700,
      y: 60,
      width: 80,
      height: 80,
    });

    const pdfBytes = await pdfDoc.save();

    await fs.writeFile(outputPath, pdfBytes);

    // Save in DB
    const certificate = await this.certificateModel.create({
      certificateId,
      userId: data.userId,
      courseId: data.courseId,
      studentName: data.studentName,
      courseName: data.courseName,
      completionDate: new Date(),
      certificateUrl: `/certificates/${certificateId}.pdf`,
    });

    return certificate;
  }

  private generateCertificateId(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `PTR-${new Date().getFullYear()}-${random}`;
  }
}