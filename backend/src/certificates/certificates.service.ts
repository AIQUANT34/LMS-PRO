import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificate, CertificateDocument } from './schemas/certificate.schema';
import { Course } from 'src/courses/schemas/course.schema';

import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as crypto from 'crypto';

import { BlockchainService } from 'src/blockchain/blockchain.service';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
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
    trainerName: string;
  }) {
    try {
      console.log('🎓 Certificate generation request received:', data);
      
      // Validate required fields
      if (!data.userId || !data.courseId || !data.studentName || !data.courseName) {
        throw new Error('Missing required fields: userId, courseId, studentName, courseName');
      }
      
      // Check if certificate already exists for this user and course
      const existingCertificate = await this.certificateModel.findOne({
        userId: data.userId,
        courseId: data.courseId
      });

      if (existingCertificate) {
        console.log('🎓 Certificate already exists for user and course:', existingCertificate.certificateId);
        return existingCertificate;
      }

      // 🔍 DEBUG - Verify course exists and get trainer info
      const course = await this.courseModel.findById(data.courseId);
      
      if (!course) {
        throw new Error(`Course not found with ID: ${data.courseId}`);
      }

      // Generate unique certificate reference
      const certificateReference = `CERT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      
      console.log('🎓 Creating certificate with reference:', certificateReference);
      
      const certificate = await this.certificateModel.create({
        certificateId: certificateReference, // Use the same reference for certificateId
        userId: data.userId,
        courseId: data.courseId,
        studentName: data.studentName,
        courseName: data.courseName,
        trainerName: data.trainerName || 'Trainer',
        completionDate: new Date(),
        isApproved: false,
        status: 'active',
        certificateReference, // Set the unique certificate reference
      });

      console.log('🎓 Certificate created successfully:', {
        certificateId: certificate.certificateId,
        userId: certificate.userId,
        courseId: certificate.courseId,
        certificateReference: certificate.certificateReference
      });
      
      return certificate;
    } catch (error) {
      console.error('🎓 Certificate generation error:', error);
      
      if (error.code === 11000) {
        // Handle duplicate key error
        console.log('🎓 Duplicate certificate detected, trying again...');
        // Retry with different reference
        return this.generateCertificate(data);
      }
      
      // Log detailed error for debugging
      console.error('🎓 Error details:', {
        message: error.message,
        stack: error.stack,
        data: data
      });
      
      throw new Error(`Certificate generation failed: ${error.message}`);
    }
  }

  // ===============================
  // GET PENDING APPROVALS (FOR TRAINERS)
  // ===============================
  async getPendingApprovals(trainerId: string) {
    console.log('🔍 Getting pending approvals for trainer:', trainerId);
    
    const certificates = await this.certificateModel
      .find({ 
        isApproved: false,
      })
      .populate('courseId', 'title trainerId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Filter certificates for trainer's courses only
    const trainerCertificates = certificates.filter(cert => {
      const course = cert.courseId as any;
      return course && course.trainerId && course.trainerId.toString() === trainerId;
    });

    console.log('🔍 Found', trainerCertificates.length, 'pending certificates for trainer');
    return trainerCertificates.map((cert) => ({
      _id: cert._id,
      certificateId: cert.certificateId,
      studentName: cert.studentName,
      studentEmail: (cert.userId as any)?.email,
      courseName: cert.courseName,
      courseTitle: (cert.courseId as any)?.title,
      completionDate: cert.completionDate,
      submittedAt: (cert as any).createdAt,
      courseId: cert.courseId,
    }));
  }

  // ===============================
  // APPROVE CERTIFICATE (WITH TRAINER AUTHORIZATION)
  // ===============================
  async approveCertificate(certificateId: string, approverId: string) {
    try {
      const certificate = await this.certificateModel
        .findById(certificateId)
        .populate('courseId', 'title trainerId');

      if (!certificate) {
        throw new Error('Certificate not found');
      }

      if (certificate.isApproved) {
        return { message: 'Certificate already approved' };
      }

      // ✅ Authorization: Verify approver owns the course
      const course = certificate.courseId as any;
      if (course.trainerId.toString() !== approverId) {
        throw new Error('Not authorized to approve this certificate');
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

      // 4️⃣ Submit hash to Cardano testnet with certificate data (optional)
      let txId: string | null = null;
      try {
        txId = await this.blockchainService.submitHashToCardano({
          certificateReference: certificate.certificateReference,
          completionHash: hash
        });
        certificate.blockchainTxId = txId;
        this.logger.log(`✅ Certificate submitted to blockchain: ${txId}`);
      } catch (blockchainError) {
        this.logger.warn(`⚠️ Blockchain submission failed, proceeding without blockchain verification: ${blockchainError.message}`);
        // Certificate approval continues without blockchain
        certificate.blockchainTxId = null;
      }

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
        .replace('{{trainerName}}', certificate.trainerName)  // ✅ Fixed: Template has {{trainerName}}
        .replace('{{date}}', date)
        .replace('{{certificateId}}', certificate.certificateId);  // ✅ Fixed: Use certificateId

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
      this.logger.error('Certificate approval failed:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Certificate not found')) {
        throw new NotFoundException('Certificate not found');
      }
      
      if (error.message.includes('Failed to load certificate template')) {
        throw new Error('Certificate template is missing or corrupted');
      }
      
      if (error.message.includes('Failed to generate PDF')) {
        throw new Error('PDF generation failed. Please check template and try again.');
      }
      
      throw new Error(`Certificate approval failed: ${error.message}`);
    }
  }

  // VERIFY CERTIFICATE

  async verifyCertificate(reference: string) {
    console.log('🔍 Verifying certificate with reference:', reference);
    
    const certificate = await this.certificateModel.findOne({
      certificateReference: reference,
    });

    if (!certificate) {
      console.log('❌ Certificate not found with reference:', reference);
      throw new NotFoundException('Certificate not found');
    }

    console.log('✅ Certificate found:', {
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      isApproved: certificate.isApproved,
      hasCompletionHash: !!certificate.completionHash
    });

    // Check if certificate is approved
    if (!certificate.isApproved) {
      console.log('❌ Certificate is not approved');
      return {
        certificateReference: certificate.certificateReference,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        isApproved: certificate.isApproved,
        isValid: false,
        error: 'Certificate is not approved yet'
      };
    }

    // Check if completionHash exists
    if (!certificate.completionHash) {
      console.log('❌ Certificate has no completion hash');
      return {
        certificateReference: certificate.certificateReference,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        isApproved: certificate.isApproved,
        isValid: false,
        error: 'Certificate has no completion hash - may need approval'
      };
    }

    // 1️⃣ Recreate minimal completion record (same structure as approval)
    const completionRecord = {
      certificateReference: certificate.certificateReference,
      courseId: certificate.courseId.toString(),
      completionDate: certificate.completionDate,
    };

    console.log('🔍 Recreating completion record:', completionRecord);

    // 2️⃣ Recalculate hash
    const recalculatedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(completionRecord))
      .digest('hex');

    console.log('🔍 Hash comparison:', {
      original: certificate.completionHash,
      recalculated: recalculatedHash,
      matches: recalculatedHash === certificate.completionHash
    });

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
      trainerName: cert.trainerName,
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
      trainerName: certificate.trainerName,
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
  // REGENERATE CERTIFICATE PDF
  // ===============================
  async regenerateCertificatePDF(id: string) {
    try {
      const certificate = await this.certificateModel
        .findById(id)
        .populate('courseId', 'title trainerId');

      if (!certificate) {
        throw new Error('Certificate not found');
      }

      console.log('🎓 Regenerating certificate PDF for:', certificate.certificateId);

      // 1️⃣ Generate QR Code
      const qrData = `https://yourplatform.com/verify/${certificate.certificateReference}`;
      const qrBase64 = await QRCode.toDataURL(qrData);

      // 2️⃣ Load HTML template
      const templatePath = path.join(
        process.cwd(),
        'templates',
        'certificate.template.html',
      );

      let html = fs.readFileSync(templatePath, 'utf-8');

      const date = new Date(certificate.completionDate).toDateString();

      // 3️⃣ Replace placeholders with correct field names
      html = html
        .replace('{{studentName}}', certificate.studentName)
        .replace('{{courseName}}', certificate.courseName)
        .replace('{{trainerName}}', certificate.trainerName)  // ✅ Fixed: Template has {{trainerName}}
        .replace('{{date}}', date)
        .replace('{{certificateId}}', certificate.certificateId);  // ✅ Fixed: Use certificateId

      // 4️⃣ Add QR code
      html = html.replace(
        '</body>',
        `<img src="${qrBase64}" class="qr-code" /></body>`,
      );

      // 5️⃣ Inject background image
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

      // 6️⃣ Generate PDF
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

      const outputPath = path.join(
        process.cwd(),
        'certificates',
        `${certificate.certificateReference}.pdf`,
      );

      await page.pdf({
        path: outputPath,
        width: '1123px',
        height: '794px',
        printBackground: true,
      });

      await browser.close();

      console.log('🎓 Certificate PDF regenerated successfully:', outputPath);

      return {
        message: 'Certificate PDF regenerated successfully',
        certificateReference: certificate.certificateReference,
        certificateUrl: certificate.certificateUrl,
      };
    } catch (error) {
      console.error('🎓 PDF Regeneration Error:', error);
      throw new Error('Certificate PDF regeneration failed. Please try again.');
    }
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
