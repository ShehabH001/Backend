/**
 * Controller functions for handling user authentication, registration, OTP verification,
 * password reset, and social login (Google, Facebook).
 *
 * Endpoints:
 * - POST /register: Register a new user and send OTP.
 * - POST /register/verify-otp: Verify OTP for registration.
 * - POST /register/resend-verification: Resend registration OTP.
 * - POST /login: Login user and return JWT token.
 * - POST /logout: Logout user.
 * - POST /forgot-password: Send OTP for password reset.
 * - POST /forgot-password/verify-otp: Verify OTP for password reset.
 * - POST /forgot-password/reset-password: Reset password using OTP.
 * - GET /me: Get current authenticated user.
 * - POST /google: Authenticate using Google OAuth.
 * - POST /facebook: Authenticate using Facebook OAuth.
 *
 * Request Body:
 * - Registration: { name, email, registration_type }
 * - OTP Verification: { email, otp }
 * - Login: { email, password }
 * - Password Reset: { email, new_password, otp }
 *
 * Dependencies:
 * - authentication: Model for user authentication and management.
 * - OTPService: Service for OTP operations.
 * - generateToken: JWT token generation.
 * - firebase-admin: For Google OAuth.
 * - axios: For Facebook OAuth.
 */

import OTPService from "../services/verification/by_email/EmailVerificationService.mjs";
import { generateToken } from "../services/access_token/accessTokenService.mjs";
import TempUser from "../models/TempUser.mjs";
import ActualUser from "../models/ActualUser.mjs";
import authentication from "../models/Authentication.mjs";

// Register a new user and send OTP
export const register = async (req, res) => {
  try {
    const user = req.body;
    if (
      !user.name ||
      !user.email ||
      !user.phone ||
      !user.country_code ||
      !user.password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    user.registration_type = "EMAIL_PASSWORD"; // default registration type is email
    console.log("User registration data:", user);
    // register the user in temp_user table and send OTP to the user
    // if the user already exists in temp_user table, it will update the user , if we can't update the user, it will throw an exception
    // if the user's otp already exists in OTP table, it will update the OTP if the user's otp is expired
    const temp_user = await TempUser.storeUser(user); // store the user in temp_user table
    await OTPService.sendRegistrationOTP(temp_user);
    return res.status(201).json(temp_user);
  } catch (error) {
    console.error("Error -> in register function:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Verify OTP for registration and create actual user
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    await OTPService.verifyOTP(email, otp);
    // get temp user then deleted it if OTP is valid, if deleting the temp user successful, it will return the temp user
    // and by default, it will delete the OTP from OTP table
    const tempUser = await TempUser.getUserByEmail(email);
    const actualUser = await ActualUser.createUser(tempUser); // store the user in user table
    // delete the temp user from temp_user table, when the user is stored successfully
    await TempUser.deleteUserByEmail(tempUser.email); // delete the temp user from temp_user table
    res.status(200).json(actualUser);
  } catch (error) {
    console.error("Error -> in verifyOtp function:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Resend registration OTP if allowed
export const resendVerification = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const canResend = await OTPService.canResendNewOTP(user.email);
    if (canResend) {
      await OTPService.sendRegistrationOTP(user); // send OTP to the user email
      return res.status(200).json({ message: "OTP resent successfully" });
    }
    return res.status(400).json({ message: "OTP is not expired" });
  } catch (error) {
    console.error("Error -> in resendVerification function:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Login user and return JWT token
export const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.registration_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await ActualUser.login(req.body);
    const token = await generateToken(user.id); // check
    res
      .status(200)
      .set({
        Authorization: `Bearer ${token}`,
        "X-Auth-Token": token,
        "Access-Control-Expose-Headers": "Authorization, X-Auth-Token",
      }) // For CORS})
      .json(user);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(401).json({ message: "Error logging" });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const user = req.user;
    await ActualUser.logout(user);
    return res
      .status(200)
      .set({
        Authorization: `Bearer null`,
        "X-Auth-Token": null,
        "Access-Control-Expose-Headers": "Authorization, X-Auth-Token",
      })
      .json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send OTP for password reset
export const forgotPassword = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    await ActualUser.getUserByEmail(user.email); // check if the actual user exists in the database
    const temp_user = await TempUser.storeUser(user);
    await OTPService.sendForgetPasswordOTP(temp_user);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword function:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Verify OTP for password reset
export const forgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    await OTPService.verifyOTP(email, otp); // verify OTP
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in forgotPasswordVerifyOtp function:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Reset password using OTP
export const resetPassword = async (req, res) => {
  try {
    const { otp, email, new_password } = req.body;
    if (!email || !new_password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // check again if the otp is valid or not
    await OTPService.verifyOTP(email, otp);
    await ActualUser.resetPassword(email, new_password);
    // delete the temp user from temp_user table
    // by default, the OTP will be deleted from OTP table
    await TempUser.deleteUserByEmail(email); // delete the temp user from temp_user table
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword function:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get current authenticated user
export const getCurrentUser = async (req, res) => {
  try {
    const actual_user = await ActualUser.getUserById(req.user);
    return res.status(200).json(actual_user);
  } catch (error) {
     res.status(401).json({ error: error.message });
  }
};

// Authenticate using Google OAuth
export const googleAuthentication = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await authentication.withGoogle(access_token);
    // store the user in actual user table if the user is not exists in actual_user table
    const actualUser = await ActualUser.storeActualUserIfNotExists(user); // store the user in actual_user table
    // Generate JWT token for the user
    const token = await generateToken(user.id);
    // Set the token in the response headers
    res
      .status(200)
      .set({
        Authorization: `Bearer ${token}`,
        "X-Auth-Token": token,
        "Access-Control-Expose-Headers": "Authorization, X-Auth-Token",
      }) // For CORS
      .json(actualUser);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Authenticate using Facebook OAuth
export const facebookAuthentication = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await authentication.withFacebook(access_token);
    // store the user in actual user table if the user is not exists in actual_user table
    const actualUser = await ActualUser.storeActualUserIfNotExists(user); // store the user in actual_user table
    // Generate JWT token for the user
    const token = await generateToken(actualUser.id);
    // Set the token in the response headers
    res
      .status(200)
      .set({
        Authorization: `Bearer ${token}`,
        "X-Auth-Token": token,
        "Access-Control-Expose-Headers": "Authorization, X-Auth-Token",
      })
      .json(actualUser);
  } catch (error) {
    console.error("Error in facebookAuthentication:", error);
    res.status(401).json({ error: error.message });
  }
};

/*
router.get("/google", (req, res) => {
  console.log("Redirecting to Google OAuth");
  res.redirect(
    `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`
  );
}); // Redirect to Google OAuth

router.get("/google/callback", async (req, res) => {
  // Handle the callback from Google OAuth
  const { code } = req.query;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  try{
    const tokenRes = await axios.post(
      `https://oauth2.googleapis.com/token`,
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }
    );
    const { access_token } = tokenRes.data;
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`,{headers: { Authorization: `Bearer ${access_token}` }});
    
    res.status(200).json({
      message: "Google OAuth successful",
      user: userRes.data,
    });
  }catch (error) {
    console.error("Error during Google OAuth callback:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
 
});
*/
