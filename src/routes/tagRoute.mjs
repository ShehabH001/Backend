/**
 * Tag routes for handling tag-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for tags.
 * - GET /: Get all tags.
 * - GET /:id: Get tag by ID.
 * - GET /:id/books: Get books by tag ID.
 *
 * Dependencies:
 * - tagController: Controller functions for tag operations.
 *
 * Exports:
 * - router: Express Router instance with tag-related routes.
 */

import { Router } from "express";
import {
  getAllTags,
  getTagBooks,
  getTagById,
  validate_cache,
} from "../controllers/tagController.mjs";

const router = Router();

router.post("/validate-cache", validate_cache); // Validate cache for tags
router.get("", getAllTags); // Get all tags
router.get("/:id", getTagById); // Get tag by ID
router.get("/:id/books", getTagBooks); // Get books by tag ID

export default router;