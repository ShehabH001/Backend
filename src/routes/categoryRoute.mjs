/**
 * Category routes for handling category-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for categories.
 * - GET /: Get all categories.
 * - GET /:id: Get category by ID.
 * - GET /:id/books: Get books by category ID.
 *
 * Dependencies:
 * - categoryController: Controller functions for category operations.
 *
 * Exports:
 * - router: Express Router instance with category-related routes.
 */

import { Router } from "express";
import {
  getAllCategories,
  getCategoryBooks,
  getCategoryById,
  validate_cache,
} from "../controllers/categoryController.mjs";

const router = Router();

router.post("/validate-cache", validate_cache); // Validate cache for categories
router.get("", getAllCategories); // Get all categories
router.get("/:id", getCategoryById); // Get category by ID
router.get("/:id/books", getCategoryBooks); // Get books by category ID

export default router;
