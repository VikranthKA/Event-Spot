require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587, // Use 587 for non-secure or 465 for secure connection
  secure: false, // Use true for secure connection, false for non-secure
  auth: {
    user: 'api',
    pass: process.env.NODE_MAILER_PASSWARD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'info@google.com', // sender address
      to: 'vikranthka@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main();
