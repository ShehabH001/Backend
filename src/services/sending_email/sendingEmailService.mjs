/**
 * Service for sending emails using the configured transporter.
 *
 * Exports:
 * - sendMail(user, mailBody): Sends an email to the specified user.
 *
 * Dependencies:
 * - transporter: Nodemailer transporter instance.
 *
 * Environment Variables:
 * - APP_NAME: The name of the application (used as the sender name).
 * - APP_SUPPORT_MAIL: The support email address (used as the sender email).
 *
 * @param {Object} user - The user object containing at least a 'user_email' property.
 * @param {Object} mailBody - The email content, must include 'subject' and either 'html' or 'text'.
 * @throws {Error} If the mail body is invalid or sending fails.
 * @returns {Promise<void>}
 */
import { transporter } from "./transporter.mjs";

export async function sendMail(user, mailBody) {
  const { subject, html, text } = mailBody;
  if (!subject || (!html && !text)) {
    throw new Error("Invalid mail body: Subject and content are required.");
  }
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.APP_SUPPORT_MAIL}>`,
    to: user.email,
    subject,
    html,
    text,
  };
  await transporter.sendMail(mailOptions);
}