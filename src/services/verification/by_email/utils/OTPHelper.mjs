/**
 * Utility functions for OTP (One-Time Password) generation and expiration checking.
 *
 * Exports:
 * - generateOTP(user): Generates a cryptographically secure OTP and stores it for the user.
 * - isOTPExpired(OTPTime, expire_time): Checks if an OTP is expired based on its timestamp.
 *
 * Dependencies:
 * - dotenv: Loads environment variables.
 * - crypto: For secure random number generation.
 * - OTP_EXPIRATION_TIME_IN_MINUTES, OTP_LENGTH: OTP configuration constants.
 * - OTP: Model for OTP database operations.
 *
 * Environment Variables:
 * - Loaded via dotenv (if needed for OTP model or other config).
 *
 * @function generateOTP
 * @param {Object} user - The user object, must contain an 'email' property.
 * @returns {Promise<string|null>} The generated OTP string, or null if storing fails.
 *
 * @function isOTPExpired
 * @param {number} OTPTime - The timestamp (in ms) when the OTP was created/updated.
 * @param {number} [expire_time] - Optional expiration time in minutes. Defaults to OTP_EXPIRATION_TIME_IN_MINUTES.
 * @returns {boolean} True if the OTP is expired, false otherwise.
 */

import dotenv from "dotenv";
import crypto from "crypto";
import { OTP_EXPIRATION_TIME_IN_MINUTES, OTP_LENGTH } from "../../../const/const.mjs";
import OTP from "../../../../models/OTP.mjs";
dotenv.config();

export const generateOTP = async (user) => {
  // Generate a cryptographically secure OTP
  const otp = Array.from({ length: OTP_LENGTH }, () =>
    crypto.randomInt(0, 10)
  ).join("");

  const isOTPStored = await OTP.storeOTP(user.email, otp);
  if (!isOTPStored) {
    return null; // Return null if OTP storage fails
  }
  return otp;
};

/**
 * Checks if the OTP is expired.
 * @param {number} OTPTime - The timestamp (in ms) when the OTP was created/updated.
 * @param {number} [expire_time] - Optional expiration time in minutes.
 * @returns {boolean} True if expired, false otherwise.
 */
export const isOTPExpired = (OTPTime, expire_time) => {
  const now = Date.now();
  const different = now - OTPTime;
  const expireTime = (expire_time || OTP_EXPIRATION_TIME_IN_MINUTES) * 60 * 1000;
  return different > expireTime;
};