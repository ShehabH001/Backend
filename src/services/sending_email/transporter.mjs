/**
 * Email transporter configuration using Nodemailer.
 *
 * Loads environment variables using dotenv and creates a reusable transporter
 * object for sending emails.
 *
 * Environment Variables:
 * - EMAIL_SERVICE: The email service provider (e.g., 'gmail').
 * - EMAIL_USERNAME: The email account username.
 * - EMAIL_PASSWORD: The email account password.
 *
 * Dependencies:
 * - dotenv: Loads environment variables from a .env file.
 * - nodemailer: For sending emails.
 */

import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});