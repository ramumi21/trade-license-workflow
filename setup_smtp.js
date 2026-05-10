const nodemailer = require('nodemailer');
const fs = require('fs');

async function setup() {
  console.log('Generating Ethereal SMTP test account...');
  const account = await nodemailer.createTestAccount();
  console.log('Account generated!');
  
  const envPath = '.env';
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(/^EMAIL_HOST=.*$/m, `EMAIL_HOST=smtp.ethereal.email`);
  envContent = envContent.replace(/^EMAIL_PORT=.*$/m, `EMAIL_PORT=587`);
  envContent = envContent.replace(/^EMAIL_USER=.*$/m, `EMAIL_USER=${account.user}`);
  envContent = envContent.replace(/^EMAIL_PASS=.*$/m, `EMAIL_PASS=${account.pass}`);
  
  fs.writeFileSync(envPath, envContent);
  console.log('Updated .env with Ethereal SMTP credentials.');
}

setup().catch(console.error);
