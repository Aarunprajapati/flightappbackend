import nodemailer from 'nodemailer';
import { ApiError } from './ApiErrors.js';



export const sendEmail = async (email, url) => {

  try {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "rohitkumar302013@gmail.com",
        pass: "gceg pwlk izba popt"
      }
    });

    const emailOptions = {
      from :'rohitkumar302013@gmail.com',
      to: email,
      subject: "Invoice Email from Flights App",
      text: "Invoice Email, Please download your Invoice",
      html: ` <div class="card">
        <h1>Your Invoice is Ready</h1>
        <p>You can download your invoice from the link below:</p>
        <a href=${url} target="_blank" class="download-button"><button>Download Invoice</button></a>
        <p>Thank you for your business!</p>
    </div>`,
    };
    const sendEmail = await transporter.sendMail(emailOptions);

    return sendEmail;
  } catch (error) {
    throw new ApiError(500, 'Error sending email', error);
  }
}