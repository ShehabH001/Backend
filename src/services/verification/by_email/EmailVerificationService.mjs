/**
 * EmailVerificationService
 *
 * Service for handling OTP (One-Time Password) operations for email verification.
 *
 * Features:
 * - Send OTP for registration and password reset.
 * - Verify OTP for a given email.
 * - Check if a new OTP can be resent.
 *
 * Dependencies:
 * - OTP: Model for OTP database operations.
 * - sendMail: Service for sending emails.
 * - generateOTP, isOTPExpired: Helpers for OTP generation and expiration logic.
 * - buildOTPEmailTemplate: Helper for building OTP email templates.
 * - Constants: OTP types and expiration settings.
 *
 * Methods:
 * - sendForgetPasswordOTP(user): Sends a password reset OTP to the user's email.
 * - sendRegisterOTP(user): Sends a registration OTP to the user's email.
 * - verifyOTP(email, otp): Verifies the provided OTP for the given email.
 * - canResendNewOTP(email): Checks if a new OTP can be resent to the email.
 */

import OTP from "../../../models/OTP.mjs";
import { sendMail } from "../../sending_email/sendingEmailService.mjs";
import { generateOTP, isOTPExpired } from "./utils/OTPHelper.mjs";
import { buildOTPEmailTemplate } from "../../sending_email/utils/mailTemplate.mjs";
import {
  FORGET_PASSWORD_OTP_TYPE,
  OTP_EXPIRATION_TIME_FOR_RESEND_OTP_IN_MINUTES,
  REGISTER_OTP_TYPE,
} from "../../const/const.mjs";

class EmailVerificationService {
  /**
   * Sends a "forget password" OTP to the user's email.
   * @param {Object} user - The user object containing email and other info.
   * @returns {Promise<void>}
   */
  static async sendForgetPasswordOTP(user) {
    return await this.#sendOTP(user, FORGET_PASSWORD_OTP_TYPE);
  }

  /**
   * Sends a registration OTP to the user's email.
   * @param {Object} user - The user object containing email and other info.
   * @returns {Promise<void>}
   */
  static async sendRegistrationOTP(user) {
    return await this.#sendOTP(user, REGISTER_OTP_TYPE);
  }

  /**
   * Internal method to generate and send an OTP email.
   * @private
   * @param {Object} user - The user object.
   * @param {string} type - The OTP type (registration or forget password).
   * @returns {Promise<void>}
   * @throws {Error} If OTP generation fails.
   */
  static async #sendOTP(user, type) {
    const otp = await generateOTP(user);
    if (!otp) {
      throw new Error("Failed to generate OTP");
    }
    const mailBody = await buildOTPEmailTemplate(type, otp);
    //await sendMail(user, mailBody);
  }

  /**
   * Verifies the OTP for the given email.
   * @param {string} email - The user's email.
   * @param {string} otp - The OTP to verify.
   * @returns {Promise<boolean>} True if OTP is valid and not expired.
   * @throws {Error} If OTP is not found, invalid, or expired.
   */
  static async verifyOTP(email, otp) {
    const otpRecord = await OTP.getOTP(email);
    if (!otpRecord) {
      throw new Error("OTP not found");
    }
    const { code, updated_at } = otpRecord;
    const isExpired = isOTPExpired(updated_at);
    if (code !== otp) {
      throw new Error("Invalid OTP");
    }
    if (isExpired) {
      throw new Error("OTP expired");
    }
    return true;
  }

  /**
   * Checks if a new OTP can be resent to the given email.
   * @param {string} email - The user's email.
   * @returns {Promise<boolean>} True if a new OTP can be resent, false otherwise.
   */
  static async canResendNewOTP(email) {
    const otpRecord = await OTP.getOTP(email);
    if (!otpRecord) {
      // If no OTP exists, allow sending a new one
      return true;
    }
    const { updated_at } = otpRecord;
    return isOTPExpired(
      updated_at,
      OTP_EXPIRATION_TIME_FOR_RESEND_OTP_IN_MINUTES
    );
  }
}

export default EmailVerificationService;