/**
 * Controller functions for handling publisher-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for publishers.
 * - GET /: Get all publishers (with pagination).
 * - GET /:id: Get publisher by ID.
 * - GET /:id/books: Get books by publisher ID (with pagination).
 *
 * Request Query Parameters:
 * - limit: Number of items to return (required for paginated endpoints).
 * - offset: Number of items to skip (required for paginated endpoints).
 * - since: Timestamp for cache validation.
 *
 * Request Body:
 * - validate-cache: { publisher_ids: Array<string> }
 *
 * Dependencies:
 * - Publisher: Model for publisher operations.
 * - Book: Model for book operations.
 */

import Book from "../models/Book.mjs";
import Publisher from "../models/Publisher.mjs";

/**
 * Validate cache consistency for a list of publisher IDs since a given timestamp.
 */
export const validate_cache = async (req, res) => {
  try {
    const { publisher_ids } = req.body;
    const { since } = req.query;
    if (!publisher_ids) {
      return res.status(400).json({ message: "Publisher IDs are required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const cache = await Publisher.validateCache(publisher_ids, since);
    return res.status(200).json(cache);
  } catch (err) {
    console.error("Error validating cache:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all publishers with pagination.
 */
export const getAllPublishers = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res
        .status(400)
        .json({ message: "Limit and offset are required" });
    }
    const publishers = await Publisher.getAllPublishers(limit, offset);
    return res.status(200).json(publishers);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting all publishers", error: err.message });
  }
};

/**
 * Get publisher by ID.
 */
export const getPublisherById = async (req, res) => {
  try {
    const { id: publisher_id } = req.params;
    if (!publisher_id) {
      return res.status(400).json({ message: "Publisher ID is required" });
    }
    const publisher = await Publisher.getPublisherById(publisher_id);
    return res.status(200).json(publisher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get books by publisher ID with pagination.
 */
export const getPublisherBooks = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const { id: publisher_id } = req.params;
    if (!limit || !offset) {
      return res
        .status(400)
        .json({ message: "Limit and offset are required" });
    }
    if (!publisher_id) {
      return res.status(400).json({ message: "Publisher ID is required" });
    }
    const books = await Book.getBooksByPublisher(publisher_id, limit, offset);
    return res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};