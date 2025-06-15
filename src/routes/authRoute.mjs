/**
 * Authentication routes for handling user registration, login, password reset, and OAuth.
 *
 * Endpoints:
 * - POST /register: Register a new user.
 * - POST /register/verify-otp: Verify OTP for registration.
 * - POST /register/resend-otp: Resend registration verification OTP.
 * - POST /login: Login user.
 * - POST /logout: Logout user.
 * - POST /forgot-password: Send OTP for password reset.
 * - POST /forgot-password/verify-otp: Verify OTP for password reset.
 * - POST /forgot-password/reset-password: Reset password using OTP.
 * - GET /me: Get current authenticated user.
 * - POST /google: Authenticate using Google OAuth.
 *
 * Dependencies:
 * - authController: Controller functions for authentication operations.
 *
 * Exports:
 * - router: Express Router instance with authentication-related routes.
 */

import { Router } from "express";

import {
  facebookAuthentication,
  forgotPassword,
  forgotPasswordVerifyOtp,
  getCurrentUser,
  googleAuthentication,
  login,
  logout,
  register,
  resendVerification,
  resetPassword as resetPassword,
  verifyOtp,
} from "../controllers/authController.mjs";

const router = Router();

router.post("/register", register); // Register user
router.post("/register/verify-otp", verifyOtp); // Verify OTP
router.post("/register/resend-otp", resendVerification); // Resend verification email with OTP

router.post("/login", login); // Login user
router.post("/logout", logout); // Logout user

router.post("/forgot-password", forgotPassword); // Send OTP to email
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOtp); // Verify OTP for password reset
router.post("/forgot-password/reset-password", resetPassword); // Update with new password by email

router.get("/me", getCurrentUser); // Get current authenticated user

router.post("/google", googleAuthentication); // Authenticate using Google OAuth
router.post("/facebook", facebookAuthentication); // Authenticate using Google OAuth

export default router;