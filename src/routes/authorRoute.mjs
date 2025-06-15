/**
 * Author routes for handling author-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for authors.
 * - GET /: Retrieve all authors.
 * - GET /: Retrieve author by ID.
 * - GET /books: Retrieve books by author ID.
 *
 * Dependencies:
 * - authorController: Controller functions for author operations.
 *
 * Exports:
 * - router: Express Router instance with author-related routes.
 */

import { Router } from "express";
import {
  getAllAuthors,
  getAuthorBooks,
  getAuthorById,
  validate_cache,
} from "../controllers/authorController.mjs";
const router = Router();

router.post("/validate-cache", validate_cache); // Validate cache for authors
router.get("", getAllAuthors); // Get all authors
router.get("/:id", getAuthorById); // Get author by id
router.get("/:id/books", getAuthorBooks); // Get books by author id

export default router;
