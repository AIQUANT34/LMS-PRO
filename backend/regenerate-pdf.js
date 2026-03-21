const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');

// Certificate data (from your debug output)
const certificate = {
  studentName: 'Anusha Raj',
  courseName: 'Business Analytics',
  trainerName: 'Anjali',
  certificateId: 'CERT-2026-703389',
  completionDate: new Date('2026-03-19T10:01:49.177Z'),
  certificateReference: 'CERT-2026-703389'
};

async function regenerateCertificatePDF() {
  try {
    console.log('🎓 Regenerating certificate PDF with correct template mapping...');

    // 1️⃣ Generate QR Code
    const qrData = `https://yourplatform.com/verify/${certificate.certificateReference}`;
    const qrBase64 = await QRCode.toDataURL(qrData);

    // 2️⃣ Load HTML template
    const templatePath = path.join(__dirname, 'templates', 'certificate.template.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    const date = new Date(certificate.completionDate).toDateString();

    // 3️⃣ Replace placeholders with CORRECT field names
    html = html
      .replace('{{studentName}}', certificate.studentName)
      .replace('{{courseName}}', certificate.courseName)
      .replace('{{trainerName}}', certificate.trainerName)  // ✅ Template has {{trainerName}}
      .replace('{{date}}', date)
      .replace('{{certificateId}}', certificate.certificateId);  // ✅ Template has {{certificateId}}

    // 4️⃣ Add QR code
    html = html.replace(
      '</body>',
      `<img src="${qrBase64}" class="qr-code" /></body>`,
    );

    // 5️⃣ Inject background image
    const imagePath = path.join(__dirname, 'templates', 'certificate-template.png');
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
      path: path.join(__dirname, 'templates', 'certificate.css'),
    });

    const outputPath = path.join(__dirname, 'certificates', `${certificate.certificateReference}.pdf`);

    await page.pdf({
      path: outputPath,
      width: '1123px',
      height: '794px',
      printBackground: true,
    });

    await browser.close();

    console.log('🎉 Certificate PDF regenerated successfully:', outputPath);
    console.log('🎓 Certificate ID:', certificate.certificateId);
    console.log('👨‍🏫 Trainer Name:', certificate.trainerName);
    
  } catch (error) {
    console.error('❌ PDF Regeneration Error:', error);
  }
}

regenerateCertificatePDF();
