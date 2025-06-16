const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create a transporter using environment variables or default configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Sends an email with the student's TIN
 * @param {string} to - Recipient email address
 * @param {string} name - Student's name
 * @param {string} tin - The generated TIN
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendTinEmail = async (to, name, tin) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your Test Identification Number (TIN)',
      html: `
        <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
      "
    >
      <h2 style="color: #333">Hello ${name},</h2>
      <p>
        Thank you for registering. Your Test Identification Number (TIN) has
        been generated. You are now eligible for test.
      </p>
      <div
        style="
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        "
      >
        <h4>Please follow the pre-requisite conditions:</h4>
        <ul style="list-style-type: disc; padding-left: 20px">
          <li>You must have a good internet Connection</li>
          <li>Use a laptop or desktop computer</li>
          <li>Use Google Chrome or Microsoft Edge browser</li>
          <li>Ensure your microphone and camera are working</li>
          <li>You can give test only <strong>once.</strong></li>
        </ul>
      </div>
      <div
        style="
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        "
      >
        <h3 style="margin: 0; color: #007bff; font-size: 24px">${tin}</h3>
      </div>
      <p>
        Please keep this TIN secure as you will need it to access your test.
      </p>
      <p>If you have any questions, please contact the administrator.</p>
      <p style="margin-top: 20px; font-size: 14px; color: #666">
        This is an automated message, please do not reply.
      </p>
    </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Create transporter for teacher credentials
const teacherTransporter = nodemailer.createTransport({
  host: "bulk.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "smtp@mailtrap.io",
    pass: "63acd31e23c1614b751786702f09feb0",
  },
});

// Function to read and replace template placeholders
const getEmailTemplate = (templateData) => {
  const templatePath = path.join(__dirname, '../templates/trainerAccountEmail.html');
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace all placeholders with actual data
  Object.keys(templateData).forEach(key => {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, 'g'), templateData[key]);
  });
  
  return template;
};

// Function to send teacher credentials email
const sendTeacherCredentialsEmail = async (teacherData, password) => {
  const templateData = {
    trainerName: teacherData.name,
    trainerEmail: teacherData.email,
    trainerPhone: teacherData.phone || 'N/A',
    trainerPassword: password,
    createdOn: new Date().toLocaleDateString(),
    loginUrl: process.env.CLIENT_URL || 'http://localhost:3000/login'
  };

  const htmlContent = getEmailTemplate(templateData);

  const mailOptions = {
    from: '"Skillvedaa Swar--"'+ process.env.EMAIL_FROM,
    to: teacherData.email,
    subject: 'Your Trainer Account Credentials - Skillvedaa Swar',
    html: htmlContent
  };

  try {
    const info = await teacherTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendTinEmail, sendTeacherCredentialsEmail };
