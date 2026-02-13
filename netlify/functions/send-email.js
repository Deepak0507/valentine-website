const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { recipientEmail, subject, message } = JSON.parse(event.body);

    // Configure Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #FFE5EC 0%, #FFC9DE 100%); border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #FF1493; font-size: 2em; margin-bottom: 20px;">💕 Someone Said YES! 💕</h1>
            <div style="font-size: 3em; margin: 20px 0;">💌</div>
            <p style="color: #666; font-size: 1.1em; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </p>
            <div style="margin-top: 30px; font-size: 2em;">
              ❤️ 💖 💕 💗 💝
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully!' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};