import Nodemailer from "nodemailer";

export default async function sendEmail(email: string, otp: number) {
  try {
    const transporter = Nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: process.env.SECURE_CONNECTION ? true : false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Your otp is: ${otp}</p>`,
    });
    return true;
  } catch (error) {
    return false;
  }
}
