/**
 * Main Express application setup.
 *
 * - Configures middleware for JSON parsing and access token verification.
 * - Registers all API routes (auth, books, categories, tags, authors, publishers, translators, changes).
 * - Handles open (public) routes without authentication (e.g., register, login, forgot-password, etc.).
 * - Applies authentication middleware to all other routes using verifyTokenMiddleware.
 * - Includes a global error handler for consistent error responses.
 *
 * Dependencies:
 * - express: Web framework for Node.js.
 * - All route modules (categoryRoutes, tagRoutes, etc.).
 * - verifyTokenMiddleware: Middleware for JWT access token validation.
 *
 * Environment Variables:
 * - STANDARD_URL_FORMAT: Prefix for all API routes (e.g., "/api/v1/").
 *
 * Exports:
 * - app: The configured Express application instance.
 */

import express from "express";
import categoryRoutes from "./routes/categoryRoute.mjs";
import tagRoutes from "./routes/tagRoute.mjs";
import bookRoutes from "./routes/bookRoute.mjs";
import authRoutes from "./routes/authRoute.mjs";
import authorRoutes from "./routes/authorRoute.mjs";
import changesRoutes from "./routes/changesRoute.mjs";
import publisherRoutes from "./routes/publisherRoute.mjs";
import translatorRoutes from "./routes/translatorRoute.mjs";
import { verifyTokenMiddleware } from "./middlewares/access_token_middleware.mjs";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { generateToken } from "./services/access_token/accessTokenService.mjs";

const limiter = rateLimit({
  windowMs: Number(process.env.LIMITER_WINDOW_MS), // 15 minutes
  max: Number(process.env.LIMITER_MAX), // Limit each IP to 100 requests per windowMs
});


const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(compression())
app.use(limiter);

// Middleware to handle Access Token verification
// Allows open (public) routes to bypass authentication
app.use(async (req, res, next) => {
  try {
    const openRoutes = [
      "",
      "register",
      "login",
      "forgot-password",
      "verify-otp",
      "resend-verification",
      "reset-password",
      "google",
      "facebook",
    ];
    if (openRoutes.includes(req.path.split("/").pop())) {
      return next();
    }
    // For protected routes, verify the access token
    await verifyTokenMiddleware(req, res, next);
  } catch (error) {
    console.error("Error in Access Token middleware:", error);
    return res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
});

// Register all API routes with the standard URL prefix
app.use(process.env.STANDARD_URL_FORMAT + "auth", authRoutes); // Authentication route
app.use(process.env.STANDARD_URL_FORMAT + "changes", changesRoutes); // Changes route
app.use(process.env.STANDARD_URL_FORMAT + "books", bookRoutes); // Book route
app.use(process.env.STANDARD_URL_FORMAT + "categories", categoryRoutes); // Categories route
app.use(process.env.STANDARD_URL_FORMAT + "tags", tagRoutes); // Tags route
app.use(process.env.STANDARD_URL_FORMAT + "authors", authorRoutes); // Authors route
app.use(process.env.STANDARD_URL_FORMAT + "publishers", publisherRoutes); // Publisher route
app.use(process.env.STANDARD_URL_FORMAT + "translators", translatorRoutes); // Translator route

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}, // Hide error details in production
  });
});
app.use(async (req, res, next) => {
  console.log("----- Request Log -----");
  console.log(`Method: ${req.method}, URL: ${req.url}, IP : ${req.ip}`);
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  console.log("Body:", req.body);
  console.log("Headers auth:", req.headers.authorization);
  console.log("----------------------");
})

export default app;