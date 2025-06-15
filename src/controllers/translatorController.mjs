/**
 * Controller functions for handling translator-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for translators.
 * - GET /: Get all translators (with pagination).
 * - GET /:id: Get translator by ID.
 * - GET /:id/books: Get books by translator ID (with pagination).
 *
 * Request Query Parameters:
 * - limit: Number of items to return (required for paginated endpoints).
 * - offset: Number of items to skip (required for paginated endpoints).
 * - since: Timestamp for cache validation.
 *
 * Request Body:
 * - validate-cache: { translator_ids: Array<string> }
 *
 * Dependencies:
 * - Translator: Model for translator operations.
 * - Book: Model for book operations.
 */

import Book from "../models/Book.mjs";
import Translator from "../models/Translator.mjs";

/**
 * Validate cache consistency for a list of translator IDs since a given timestamp.
 */
export const validate_cache = async (req, res) => {
  try {
    const { translator_ids } = req.body;
    const { since } = req.query;
    if (!translator_ids) {
      return res.status(400).json({ message: "Translator IDs are required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const cache = await Translator.validateCache(translator_ids, since);
    return res.status(200).json(cache);
  } catch (err) {
    console.error("Error validating cache:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all translators with pagination.
 */
export const getAllTranslators = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res
        .status(400)
        .json({ message: "Limit and offset are required" });
    }
    const translators = await Translator.getAllTranslators(limit, offset);
    return res.status(200).json(translators);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting all translators", error: err.message });
  }
};

/**
 * Get translator by ID.
 */
export const getTranslatorById = async (req, res) => {
  try {
    const { id: translator_id } = req.params;
    if (!translator_id) {
      return res.status(400).json({ message: "Translator ID is required" });
    }
    const translator = await Translator.getTranslatorById(translator_id);
    return res.status(200).json(translator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get books by translator ID with pagination.
 */
export const getTranslatorBooks = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const { id: translator_id } = req.params;
    if (!limit || !offset) {
      return res
        .status(400)
        .json({ message: "Limit and offset are required" });
    }
    if (!translator_id) {
      return res.status(400).json({ message: "Translator ID is required" });
    }
    const books = await Book.getBooksByTranslator(translator_id, limit, offset);
    return res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};