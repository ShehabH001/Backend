/**
 * Publisher routes for handling publisher-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for publishers.
 * - GET /: Get all publishers.
 * - GET /:id: Get publisher by ID.
 * - GET /:id/books: Get books by publisher ID.
 *
 * Dependencies:
 * - publisherController: Controller functions for publisher operations.
 *
 * Exports:
 * - router: Express Router instance with publisher-related routes.
 */

import { Router } from "express";
import {
  getAllPublishers,
  getPublisherBooks,
  getPublisherById,
  validate_cache,
} from "../controllers/publisherController.mjs";

const router = Router();

router.post("/validate-cache", validate_cache); // Validate cache for publishers
router.get("", getAllPublishers); // Get all publishers
router.get("/:id", getPublisherById); // Get publisher by ID
router.get("/:id/books", getPublisherBooks); // Get books by publisher ID

export default router;