/**
 * Service for generating and verifying JWT access tokens.
 *
 * Functions:
 * - generateToken(userId): Generates a JWT token for a given user ID.
 * - verifyToken(tokenValue): Verifies a JWT token and returns the user ID from its payload.
 *
 * Environment Variables:
 * - JWT_SECRET: Secret key used to sign and verify tokens.
 *
 * Dependencies:
 * - jsonwebtoken: For JWT operations.
 * - SESSION_TIME_IN_DAYS: Token expiration time (imported from constants).
 */

import jwt from "jsonwebtoken";
import { SESSION_TIME_IN_DAYS } from "../const/const.mjs";

/**
 * Generates a JWT token for the given user ID.
 * @param {string|number} userId - The user ID to include in the token payload.
 * @returns {string} Signed JWT token.
 */
export const generateToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '10y',
  });
};

/**
 * Verifies a JWT token and extracts the user ID.
 * @param {string} tokenValue - The JWT token to verify.
 * @returns {string|number} The user ID from the token payload.
 * @throws {Error} If the token is invalid or expired.
 */
export const verifyToken = async (tokenValue) => {
  const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
  return decoded.id; // Return the user ID from the token payload
};
