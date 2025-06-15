/**
 * Utility for building OTP email templates.
 *
 * Exports:
 * - buildOTPEmailTemplate(type, otp): Generates a subject, HTML, and text body for OTP emails.
 *
 * Dependencies:
 * - dotenv: Loads environment variables for app name and support email.
 * - FORGET_PASSWORD_OTP_TYPE, REGISTER_OTP_TYPE: OTP type constants.
 * - OTP_EXPIRATION_TIME_IN_MINUTES: Expiration time for OTPs.
 *
 * Environment Variables:
 * - APP_NAME: The name of the application (used in the footer).
 * - APP_SUPPORT_MAIL: The support email address (used in the footer and contact link).
 *
 * @param {string} type - The OTP type (e.g., REGISTER_OTP_TYPE, FORGET_PASSWORD_OTP_TYPE).
 * @param {string|number} otp - The OTP code to include in the email.
 * @returns {Promise<{subject: string, html: string, text: string}>} The email subject, HTML, and plain text content.
 * @throws {Error} If the OTP type is invalid.
 */

import dotenv from "dotenv";
import { FORGET_PASSWORD_OTP_TYPE, OTP_EXPIRATION_TIME_IN_MINUTES, REGISTER_OTP_TYPE } from "../../const/const.mjs";
dotenv.config();

export const buildOTPEmailTemplate = async (type, otp) => {
  const baseTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://stage.asfcs.org/wp-content/uploads/2023/10/Asset-1.png" alt="Company Logo" style="max-width: 200px; height: auto;">
          </div>`;

  let greeting, content, subject;

  switch (type) {
    case REGISTER_OTP_TYPE:
      subject = "Confirm Your Email Address";
      greeting = `<h1 style="color: #2c3e50; text-align: center;">Welcome to Our Service!</h1>`;
      content = `
            <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
              Thank you for registering with us. To complete your registration, please enter the following verification code:
            </p>`;
      break;

    case FORGET_PASSWORD_OTP_TYPE:
      subject = "Password Reset Request";
      greeting = `<h1 style="color: #2c3e50; text-align: center;">Reset Your Password</h1>`;
      content = `
            <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
              We received a request to reset your password. Please use the following verification code to proceed:
            </p>`;
      break;

    default:
      throw new Error("Invalid OTP type");
  }

  const otpSection = `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; 
                      font-size: 28px; letter-spacing: 8px; text-align: center; 
                      margin: 25px 0; font-weight: bold; color: #2c3e50;
                      border: 1px dashed #bdc3c7;"> ${otp} </div>
          
          <div style="background: #f1f8fe; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #2980b9; margin-top: 0;">Important Information</h3>
            <ul style="padding-left: 20px; color: #7f8c8d;">
              <li>This code will expire in ${OTP_EXPIRATION_TIME_IN_MINUTES} minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this, please secure your account</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #ecf0f1; padding-top: 20px; color: #7f8c8d; font-size: 14px;">
            <p>Need help? Contact our support team at <a href="mailto:${
              process.env.APP_SUPPORT_MAIL
            }" style="color: #3498db;">${process.env.APP_SUPPORT_MAIL}</a></p>
            <p>© ${new Date().getFullYear()} ${
    process.env.APP_NAME
  }. All rights reserved.</p>
          </div>`;

  const html = baseTemplate + greeting + content + otpSection + `</div>`;

  return {
    subject,
    html,
    text: `Your verification code is: ${otp}\nThis code will expire in ${OTP_EXPIRATION_TIME_IN_MINUTES} minutes.`,
  };
};