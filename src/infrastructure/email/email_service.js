/** @file email_service.js - Handles automated email delivery of approved licenses using Nodemailer and Clerk identity. */
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    console.log(`[EmailService Debug] Init with Host: '${process.env.SMTP_HOST}', User: '${process.env.SMTP_USER}', Port: '${process.env.SMTP_PORT}'`);
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      auth: {
        user: process.env.SMTP_USER || 'placeholder_user',
        pass: process.env.SMTP_PASS || 'placeholder_pass',
      },
    });
  }

  async sendApprovalEmail(to, applicantName, applicationId) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Trade License System" <noreply@tradelicense.gov.et>',
        to: to,
        subject: `Your Trade License is Approved - ${applicationId}`,
        text: `Dear ${applicantName},\n\nCongratulations! Your trade license application (ID: ${applicationId}) has been approved. You can now log in to the portal to view and download your official license certificate.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Congratulations, ${applicantName}!</h2>
            <p>Your trade license application (<strong>ID: ${applicationId}</strong>) has been <strong>approved</strong>.</p>
            <p>You can now log in to the portal to view and download your official license certificate.</p>
            <br/>
            <p>Best regards,</p>
            <p>Ministry of Trade and Regional Integration</p>
          </div>
        `
      };

      console.log(`[EmailService Debug] Attempting to send email to: ${to}`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EmailService Debug] Email sent successfully. Response:', info.response, 'Message ID:', info.messageId);
      
      // If using Ethereal email for testing, log the preview URL
      const testUrl = nodemailer.getTestMessageUrl(info);
      if (testUrl) {
        console.log(`[EmailService Debug] ✉️  Preview Email: ${testUrl}`);
      }
    } catch (error) {
      console.error('[EmailService Debug] Failed to send license email:', error);
      console.error('[EmailService Debug] Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      throw error;
    }
  }
}

module.exports = { EmailService };
