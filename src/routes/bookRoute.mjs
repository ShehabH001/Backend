/**
 * Book routes for handling book-related operations and sub-resources.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for books.
 * - POST /: Get all books or search books by name or author name.
 * - GET /:id: Retrieve a book by its ID.
 * - GET /:id/categories: Retrieve categories for a specific book.
 * - GET /:id/tags: Retrieve tags for a specific book.
 * - GET /:id/authors: Retrieve authors for a specific book.
 * - GET /:id/translators: Retrieve translators for a specific book.
 * - GET /:id/reviewers: Retrieve reviewers for a specific book.
 * - GET /:id/rating: Retrieve rating for a specific book.
 * - GET /:id/token/:token_sequence: Retrieve a token for a specific book and token sequence.
 * - GET /:id/download: Download a specific book.
 * - GET /:id/metadata: Retrieve metadata for a specific book.
 * - POST /fliters: Get all filters for books (note: "fliters" may be a typo, consider "filters").
 * - /:id/annotations: Nested routes for book annotations.
 *
 * Dependencies:
 * - bookController: Controller functions for book operations.
 * - annotationRoutes: Router for annotation-related endpoints.
 *
 * Exports:
 * - router: Express Router instance with book-related routes.
 */

import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  getBookCategories,
  getBookTags,
  getBookAuthors,
  getBookReviewers,
  getToken,
  downloadBook,
  getBookRating,
  getBookTranslators,
  getMetadata,
  validate_cache,
  getBooksWithFlitter,
  uploadBook,
} from "../controllers/bookController.mjs";
import annotationRoutes from "./annotationRoute.mjs";
const router = Router();

router.post("/validate-cache", validate_cache);
router.post("", getAllBooks); // Get all books or search books by name or author name
router.get("/:id", getBookById);
router.get("/:id/categories", getBookCategories);
router.get("/:id/tags", getBookTags);
router.get("/:id/authors", getBookAuthors);
router.get("/:id/translators", getBookTranslators);
router.get("/:id/reviewers", getBookReviewers);
router.get("/:id/rating", getBookRating);
router.get("/:id/token/:token_sequence", getToken);
router.get("/:id/download", downloadBook);
router.get("/:id/metadata", getMetadata);
router.post("/fliters", getBooksWithFlitter); // Get all flitters for books
router.post("/:id", uploadBook);
// Annotation routes for books
router.use("/:id/annotations", annotationRoutes);

export default router;
