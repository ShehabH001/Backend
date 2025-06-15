/**
 * Controller functions for handling author-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for authors.
 * - GET /: Get all authors (with pagination).
 * - GET /:id: Get author by ID.
 * - GET /:id/books: Get books by author ID (with pagination).
 *
 * Request Query Parameters:
 * - limit: Number of items to return (required for paginated endpoints).
 * - offset: Number of items to skip (required for paginated endpoints).
 * - since: Timestamp for cache validation.
 *
 * Request Body:
 * - validate-cache: { author_ids: Array<string> }
 *
 * Dependencies:
 * - Author: Model for author operations.
 * - Book: Model for book operations.
 */

import Author from "../models/Author.mjs";
import Book from "../models/Book.mjs";

/**
 * Validate cache consistency for a list of author IDs since a given timestamp.
 */
export const validate_cache = async (req, res) => {
  try {
    const { author_ids } = req.body;
    const { since } = req.query;
    if (!author_ids) {
      return res.status(400).json({ message: "Author IDs are required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const cache = await Author.validateCache(author_ids, since);
    return res.status(200).json(cache);
  } catch (err) {
    console.error("Error validating cache:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all authors with pagination.
 */
export const getAllAuthors = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res.status(400).json({ message: "Limit and offset are required" });
    }
    const authors = await Author.getAllAuthors(limit, offset);
    return res.status(200).json(authors);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error getting all authors", error: err.message });
  }
};

/**
 * Get author by ID.
 */
export const getAuthorById = async (req, res) => {
  try {
    const { id: author_id } = req.params;
    if (!author_id) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const author = await Author.getAuthorById(author_id);
    return res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get books by author ID with pagination.
 */
export const getAuthorBooks = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const { id: author_id } = req.params;
    if (!limit || !offset) {
      return res.status(400).json({ message: "Limit and offset are required" });
    }
    if (!author_id) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const books = await Book.getBookByAuthor(author_id, limit, offset);
    return res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
