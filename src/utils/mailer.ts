import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

console.log(`Connecting to email service with user: ${env.EMAIL_USER}`);

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter Verify Error:", error);
        console.error("DEBUG TIP: Ensure EMAIL_USER is your real Gmail and EMAIL_PASS is a 16-character App Password.");
    } else {
        console.log("Mail server is ready to take messages");
    }
});

export const sendResetPasswordEmail = async (email: string, resetToken: string) => {
    const resetUrl = `${env.APP_URL}/auth/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"Collage Campus Admin" <${env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your Password - Collage Campus",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">&copy; ${new Date().getFullYear()} Collage Campus. All rights reserved.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};
