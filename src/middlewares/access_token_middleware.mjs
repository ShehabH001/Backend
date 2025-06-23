/**
 * Middleware for verifying JWT access tokens in incoming requests.
 *
 * This middleware checks for the presence and validity of a Bearer token in the Authorization header.
 * If the token is valid, the decoded user payload is attached to req.user and the request proceeds.
 * If the token is missing, malformed, or invalid, a 401 Unauthorized response is returned.
 *
 * Usage:
 *   app.use(verifyTokenMiddleware);
 *
 * Dependencies:
 * - verifyToken: Function to verify and decode JWT tokens.
 */

import { verifyToken } from "../services/access_token/accessTokenService.mjs";

export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    console.log("Authorization Header:", authorizationHeader);
    if (!authorizationHeader)
      return res.status(401).send("Access denied. No token provided.");

    const tokenParts = authorizationHeader.split(" ");
    if (tokenParts.length !== 2)
      return res.status(401).send("Access denied. Invalid token format.");

    const tokenType = tokenParts[0].toLowerCase();
    const tokenValue = tokenParts[1];

    if (tokenType !== "bearer")
      return res.status(401).send("Access denied. Invalid token type.");

    const verificationResult = await verifyToken(tokenValue);
    if (verificationResult) {
      req.user = verificationResult; // Attach the user payload to the request object
      next();
    } else {
      res.status(401).send("Access denied. Token is expired or invalid.");
    }
  } catch (error) {
    console.error("Error in access token middleware:", error);
    return res.status(401).json({ message: "Access denied or token is expired" });
  }
};