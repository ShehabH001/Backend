/**
 * Controller functions for handling tag-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for tags.
 * - GET /: Get all tags (with pagination or by IDs).
 * - GET /:id: Get tag by ID.
 * - GET /:id/books: Get books by tag ID (with pagination).
 *
 * Request Query Parameters:
 * - limit: Number of items to return (required for paginated endpoints).
 * - offset: Number of items to skip (required for paginated endpoints).
 * - since: Timestamp for cache validation.
 *
 * Request Body:
 * - validate-cache: { tag_ids: Array<string> }
 * - getAllTags: { tag_ids: Array<string> } (optional, for filtering by IDs)
 *
 * Dependencies:
 * - Tag: Model for tag operations.
 * - Book: Model for book operations.
 */

import Book from "../models/Book.mjs";
import Tag from "../models/Tag.mjs";

/**
 * Validate cache consistency for a list of tag IDs since a given timestamp.
 */
export const validate_cache = async (req, res) => {
  try {
    const { tag_ids } = req.body;
    const { since } = req.query;
    if (!tag_ids) {
      return res.status(400).json({ message: "Tag IDs are required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const cache = await Tag.validateCache(tag_ids, since);
    return res.status(200).json(cache);
  } catch (err) {
    console.error("Error validating cache:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all tags with pagination or by a list of tag IDs.
 */
export const getAllTags = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res.status(400).json({ message: "Limit and offset are required" });
    }
    const tags = await Tag.getAllTags(limit, offset);
    return res.status(200).json(tags);
  } catch (err) {
    return res.status(500).json({ message: "Error getting tags", error: err.message });
  }
};

/**
 * Get tag by ID.
 */
export const getTagById = async (req, res) => {
  try {
    const { id: tag_id } = req.params;
    if (!tag_id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }
    const tag = await Tag.findById(tag_id);
    return res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get books by tag ID with pagination.
 */
export const getTagBooks = async (req, res) => {
  try {
    const { id: tag_id } = req.params;
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res.status(400).json({ message: "Limit and offset are required" });
    }
    if (!tag_id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }
    const books = await Book.getBooksByTags(tag_id, limit, offset);
    return res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
