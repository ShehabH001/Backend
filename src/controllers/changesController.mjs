/**
 * Controller functions for handling change tracking in various tables.
 *
 * Endpoints:
 * - GET /general: Retrieve general changes since a given timestamp.
 * - GET /book-tables: Retrieve changes related to book tables since a given timestamp and book ID.
 * - GET /user-tables: Retrieve changes related to user tables since a given timestamp and user ID.
 * - GET /user-book-tables: Retrieve changes related to user-book tables since a given timestamp, book ID, and user ID.
 *
 * Request Query Parameters:
 * - since: Timestamp for change tracking (required for all endpoints).
 *
 * Request Body:
 * - book-tables: { book_id: string }
 * - user-tables: { user_id: string }
 * - user-book-tables: { book_id: string, user_id: string }
 *
 * Dependencies:
 * - Changes: Model for change tracking operations.
 */

import Changes from "../models/Changes.mjs";

/**
 * Retrieve general changes since a given timestamp.
 */
export const generalChanges = async (req, res) => {
  try {
    const { since } = req.query;
    if (!since) {
      return res.status(400).json({ message: "Missing 'since' parameter" });
    }
    const changes = await Changes.getGeneralChanges(since);
    return res.status(200).json(changes);
  } catch (error) {
    console.error("Error in generalChanges:", error);
    return res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};

/**
 * Retrieve changes related to book tables since a given timestamp and book ID.
 */
export const bookTablesChanges = async (req, res) => {
  try {
    const { since } = req.query;
    const { book_id } = req.body;
    if (!since) {
      return res.status(400).json({ message: "Missing 'since' parameter" });
    }
    if (!book_id) {
      return res.status(400).json({ message: "Missing 'book_id' parameter" });
    }
    const changes = await Changes.getBookTablesChanges(since, book_id);
    return res.status(200).json(changes);
  } catch (error) {
    console.error("Error in bookTablesChanges:", error);
    return res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};

/**
 * Retrieve changes related to user tables since a given timestamp and user ID.
 */
export const userTablesChanges = async (req, res) => {
  try {
    const { since } = req.query;
    const { user_id } = req.body;
    if (!since) {
      return res.status(400).json({ message: "Missing 'since' parameter" });
    }
    if (!user_id) {
      return res.status(400).json({ message: "Missing 'user_id' parameter" });
    }
    const changes = await Changes.getUserTablesChanges(since, user_id);
    return res.status(200).json(changes);
  } catch (error) {
    console.error("Error in userTablesChanges:", error);
    return res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};

/**
 * Retrieve changes related to user-book tables since a given timestamp, book ID, and user ID.
 */
export const userBookTablesChanges = async (req, res) => {
  try {
    const { since } = req.query;
    const { book_id, user_id } = req.body;
    if (!since) {
      return res.status(400).json({ message: "Missing 'since' parameter" });
    }
    if (!book_id) {
      return res.status(400).json({ message: "Missing 'book_id' parameter" });
    }
    if (!user_id) {
      return res.status(400).json({ message: "Missing 'user_id' parameter" });
    }
    const changes = await Changes.getUserBookTablesChanges(since, book_id, user_id);
    return res.status(200).json(changes);
  } catch (error) {
    console.error("Error in userBookTablesChanges:", error);
    return res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};
