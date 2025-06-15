/**
 * Controller functions for handling book annotations, highlights, bookmarks, and notes.
 *
 * Endpoints:
 * - POST /:id/sync-highlights: Sync highlights (add, update, delete) for a book.
 * - POST /:id/sync-bookmarks: Sync bookmarks (add, update, delete) for a book.
 * - POST /:id/sync-notes: Sync notes (add, update, delete) for a book.
 * - GET /:id: Retrieve all annotations for a book.
 * - GET /:id/highlights: Retrieve highlights for a book.
 * - GET /:id/bookmarks: Retrieve bookmarks for a book.
 * - GET /:id/notes: Retrieve notes for a book.
 *
 * Request Body for Sync Endpoints:
 * {
 *   items: [
 *     {
 *       id: string,           // Local ID (for new items)
 *       serverId: string,     // Server ID (for existing items)
 *       is_deleted: boolean,  // true if item should be deleted
 *       ...other fields...
 *     },
 *     ...
 *   ]
 * }
 * The server separates items into new, updated, and deleted based on:
 * - is_deleted === true   → deleted
 * - serverId exists       → updated
 * - else                  → new
 *
 * Dependencies:
 * - Note, Highlight, Bookmark models for annotation operations.
 */

import Bookmark from "../models/Bookmark.mjs";
import Highlight from "../models/Highlights.mjs";
import Note from "../models/Note.mjs";

export const getBookAnnotations = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { since } = req.query;
    const user_id = req.user;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const notes = await Note.getNotes(user_id, book_id, since);
    const highlights = await Highlight.getHighlights(user_id, book_id, since);
    const bookmarks = await Bookmark.getBookmarks(user_id, book_id, since);
    return res
      .status(200)
      .json({ notes: notes, highlights: highlights, bookmarks: bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookHighlights = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { since } = req.query;
    const user_id = req.user;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const highlights = await Highlight.getHighlights(user_id, book_id, since);
    return res.status(200).json(highlights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookBookmarks = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { since } = req.query;
    const user_id = req.user;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const bookmarks = await Bookmark.getBookmarks(user_id, book_id, since);
    return res.status(200).json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookNotes = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { since } = req.query;
    const user_id = req.user;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    const notes = await Note.getNotes(user_id, book_id, since);
    return res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const syncBookHighlights = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { items: highlights } = req.body;
    const user_id = req.user;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!highlights || !Array.isArray(highlights)) {
      return res.status(400).json({ message: "Highlights are required" });
    }
    const result = await Highlight.highlights(user_id, book_id, highlights);
    return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const syncBookBookmarks = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { items: bookmarks } = req.body;
    const user_id = req.user;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!bookmarks || !Array.isArray(bookmarks)) {
      return res.status(400).json({ message: "Bookmarks are required" });
    }
    const result = await Bookmark.bookmarks(user_id, book_id, bookmarks);
    return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const syncBookNotes = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { items: notes } = req.body;
    const user_id = req.user;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!notes || !Array.isArray(notes)) {
      return res.status(400).json({ message: "Notes are required" });
    }
    const result = await Note.notes(user_id, book_id, notes);
    return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
