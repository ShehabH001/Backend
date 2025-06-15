/**
 * Translator routes for handling translator-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for translators.
 * - GET /: Get all translators.
 * - GET /:id: Get translator by ID.
 * - GET /:id/books: Get books by translator ID.
 *
 * Dependencies:
 * - translatorController: Controller functions for translator operations.
 *
 * Exports:
 * - router: Express Router instance with translator-related routes.
 */

import { Router } from "express";
import {
  getAllTranslators,
  getTranslatorBooks,
  getTranslatorById,
  validate_cache,
} from "../controllers/translatorController.mjs";

const router = Router();

router.post("/validate-cache", validate_cache); // Validate cache for translators
router.get("", getAllTranslators); // Get all translators
router.get("/:id", getTranslatorById); // Get translator by ID
router.get("/:id/books", getTranslatorBooks); // Get books by translator ID

export default router;