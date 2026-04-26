const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

class PdfGenerationService {
  /**
   * Generates a trade license PDF and pipes it to a writable stream (e.g., HTTP response).
   * @param {Object} application The application data
   * @param {stream.Writable} writableStream The output stream
   */
  async generateLicense(application, writableStream) {
    // 1. Initialize Document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(writableStream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // 2. Structural Layout (Border & Watermark)
    const margin = 30;
    
    // Outer border
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin)
       .lineWidth(3)
       .strokeColor('#1a365d')
       .stroke();
    
    // Inner border
    doc.rect(margin + 5, margin + 5, pageWidth - 2 * margin - 10, pageHeight - 2 * margin - 10)
       .lineWidth(1)
       .strokeColor('#1a365d')
       .stroke();

    // Watermark
    doc.save();
    doc.fontSize(70)
       .font('Helvetica-Bold')
       .fillColor('#e0e0e0')
       .opacity(0.3);
    
    doc.rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] });
    doc.text('OFFICIAL LICENSE', pageWidth / 2 - 300, pageHeight / 2 - 50, { 
      align: 'center', 
      width: 600 
    });
    doc.restore();

    // 3. Header & Branding
    // Logo Placeholder
    doc.circle(90, 95, 25)
       .lineWidth(2)
       .strokeColor('#1a365d')
       .stroke();
    doc.font('Times-Bold')
       .fontSize(22)
       .fillColor('#1a365d')
       .text('TL', 75, 83);

    // Text Headers
    doc.font('Times-Bold')
       .fontSize(16)
       .text('FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA', 140, 75);
    doc.font('Times-Roman')
       .fontSize(14)
       .text('Ministry of Trade and Regional Integration', 140, 100);

    // 4. Main Content
    doc.moveDown(4);
    doc.font('Times-Bold')
       .fontSize(24)
       .fillColor('#000000')
       .text('TRADE LICENSE CERTIFICATE', { align: 'center' });

    doc.moveDown(2);

    // Key Identifier Box
    const boxWidth = 350;
    const boxX = (pageWidth - boxWidth) / 2;
    const boxY = doc.y;
    
    doc.rect(boxX, boxY, boxWidth, 30)
       .fillAndStroke('#f0f4f8', '#1a365d');
    
    doc.fillColor('#1a365d')
       .fontSize(14)
       .font('Times-Bold')
       .text(`LICENSE ID: ${application.id}`, boxX, boxY + 8, { 
         align: 'center', 
         width: boxWidth 
       });

    doc.moveDown(3);

    // Tabular Details
    const startX = 120;
    let currentY = doc.y;
    const labelWidth = 150;

    const addRow = (label, value) => {
      doc.font('Times-Bold').fillColor('#000000').fontSize(12);
      doc.text(label, startX, currentY);
      doc.font('Times-Roman').text(value || 'N/A', startX + labelWidth, currentY);
      currentY += 25;
    };

    addRow('Applicant ID:', application.applicantId);
    addRow('License Type:', application.licenseType);
    addRow('Status:', application.status);
    
    if (application.commodityId) {
      addRow('Commodity ID:', application.commodityId);
    }

    // 5. Authorization & Security
    const bottomY = pageHeight - 140;

    // Date
    const dateStr = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
    doc.font('Times-Bold')
       .fontSize(12)
       .fillColor('#000000')
       .text(`Date of Issue: ${dateStr}`, 70, bottomY);

    // Signature
    doc.moveTo(pageWidth - 220, bottomY + 15)
       .lineTo(pageWidth - 70, bottomY + 15)
       .lineWidth(1)
       .strokeColor('#000000')
       .stroke();
    doc.font('Times-Italic')
       .fontSize(12)
       .text('Authorized Signatory', pageWidth - 220, bottomY + 20, { 
         width: 150, 
         align: 'center' 
       });

    // Verification Hash
    const shortId = application.id ? application.id.split('-')[0].toUpperCase() : 'UNKNOWN';
    const verificationHash = `VERIFICATION-HASH-${shortId}`;
    
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('gray')
       .text(
         `To verify this license, provide this hash to an official clerk: ${verificationHash}`,
         0, pageHeight - 45, { align: 'center' }
       );

    // 6. Dynamic QR Code Verification
    try {
      const verifyUrl = `http://localhost:5173/verify/${application.id}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        margin: 2, 
        color: { dark: '#000000', light: '#ffffff' } 
      });
      // Place it in the bottom right corner above the border
      doc.image(qrDataUrl, pageWidth - margin - 75, pageHeight - margin - 85, { width: 70 });
    } catch (err) {
      console.error('Failed to generate QR Code for PDF:', err);
    }

    // Finalize the PDF
    doc.end();
  }
}

module.exports = { PdfGenerationService };
