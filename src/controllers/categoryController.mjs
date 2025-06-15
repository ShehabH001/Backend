/**
 * Controller functions for handling category-related operations.
 *
 * Endpoints:
 * - POST /validate-cache: Validate cache consistency for categories.
 * - GET /: Get all categories (with pagination).
 * - GET /:id: Get category by ID.
 * - GET /:id/books: Get books by category ID (with pagination).
 *
 * Request Query Parameters:
 * - limit: Number of items to return (required for paginated endpoints).
 * - offset: Number of items to skip (required for paginated endpoints).
 * - since: Timestamp for cache validation.
 *
 * Request Body:
 * - validate-cache: { category_ids: Array<string> }
 *
 * Dependencies:
 * - Category: Model for category operations.
 * - Book: Model for book operations.
 */

import Book from "../models/Book.mjs";
import Category from "../models/Category.mjs";

/**
 * Validate cache consistency for a list of category IDs since a given timestamp.
 */
export const validate_cache = async (req, res) => {
  try {
    const { category_ids } = req.body;
    const { since } = req.query;
    if (!category_ids) {
      return res.status(400).json({ message: "Category IDs are required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const cache = await Category.validateCache(category_ids, since);
    return res.status(200).json(cache);
  } catch (err) {
    console.error("Error validating cache:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all categories with pagination.
 */
export const getAllCategories = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res
        .status(400)
        .json({ message: "Limit and offset are required" });
    }
    const categories = await Category.getAllCategories(limit, offset);
    return res.status(200).json(categories);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting all categories", error: err.message });
  }
};

/**
 * Get category by ID.
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id: category_id } = req.params;
    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const category = await Category.findById(category_id);
    return res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get books by category ID with pagination.
 */
export const getCategoryBooks = async (req, res) => {
  try {
    const { id: category_id } = req.params;
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res
        .status(400)
        .json({ message: "Limit and offset are required" });
    }
    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const books = await Book.getBookByCategory(category_id, limit, offset);
    return res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
