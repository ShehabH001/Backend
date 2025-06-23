/**
 * Controller functions for handling book-related operations and sub-resources.
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
 * Request Query Parameters:
 * - limit: Number of items to return (required for paginated endpoints).
 * - offset: Number of items to skip (required for paginated endpoints).
 * - since: Timestamp for cache validation.
 *
 * Request Body:
 * - validate-cache: { book_ids: Array<string> }
 * - getAllBooks: { book_name, author_name, book_ids }
 *
 * Dependencies:
 * - Book, Author, Category, Tag, Token, Translator: Models for book operations.
 */

import Author from "../models/Author.mjs";
import Book from "../models/Book.mjs";
import Category from "../models/Category.mjs";
import Tag from "../models/Tag.mjs";
import Token from "../models/Token.mjs";
import Translator from "../models/Translator.mjs";

/**
 * Validate cache consistency for a list of book IDs since a given timestamp.
 */
export const validate_cache = async (req, res) => {
  try {
    const { book_ids } = req.body;
    const { since } = req.query;
    if (!since) {
      return res.status(400).json({ message: "Since parameter is required" });
    }
    if (!book_ids) {
      return res.status(400).json({ message: "Book IDs are required" });
    }
    const cache = await Book.validateCache(book_ids, since);
    return res.status(200).json(cache);
  } catch (err) {
    console.error("Error validating cache:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all books or search books by name or author name, with pagination.
 */
export const getAllBooks = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    if (!limit || !offset) {
      return res.status(400).json({ message: "Limit and offset are required" });
    }
    let books = null;
    let { book_name, author_name, book_ids } = req.body;

    if (book_ids) {
      book_ids = book_ids.map((row) => row["id"]);
      // If book_ids are provided, return books by book_ids
      books = await Book.getBookByIds(book_ids);
      return res.status(200).json(books);
    } else if (!book_name && !author_name) {
      // If no book name or author name is provided, return all books by pagination
      books = await Book.getAllBooks(limit, offset);
    } else if (book_name && !author_name) {
      // If only book name is provided, return books by book name by pagination
      books = await Book.findBookByName(book_name, limit, offset);
    } else if (!book_name && author_name) {
      // If only author name is provided, return books by author name by pagination
      books = await Book.findBookByAuthorName(author_name, limit, offset);
    } else if (book_name && author_name) {
      return res.status(400).json({
        message: "You can only search by book name or author name, not both",
      });
    }
    return res.status(200).json(books);
  } catch (err) {
    console.error("Error getting all books:", err);
    return res
      .status(500)
      .json({ message: "Error getting all books", error: err.message });
  }
};

/**
 * Get a book by its ID.
 */
export const getBookById = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const book = await Book.getBookById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get categories for a specific book.
 */
export const getBookCategories = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const categories = await Category.getBookCategories(book_id);
    return res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get tags for a specific book.
 */
export const getBookTags = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const tags = await Tag.getBookTags(book_id);
    return res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get authors for a specific book.
 */
export const getBookAuthors = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const authors = await Author.getBookAuthors(book_id);
    return res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get translators for a specific book.
 */
export const getBookTranslators = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const translators = await Translator.getBookTranslators(book_id);
    return res.status(200).json(translators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get reviewers for a specific book.
 */
export const getBookReviewers = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const reviewers = await Book.getBookReviews(book_id);
    return res.status(200).json(reviewers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get rating for a specific book.
 */
export const getBookRating = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const rating = await Book.getBookRating(book_id);
    return res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get a token for a specific book and token sequence.
 */
export const getToken = async (req, res) => {
  try {
    const { id: book_id, token_sequence } = req.params;
    if (!token_sequence) {
      return res.status(400).json({ message: "Token sequence is required" });
    }
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const token = await Token.getToken(book_id, token_sequence);
    return res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Download a specific book.
 */
export const downloadBook = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const tokens = await Token.getTokens(book_id);
    return res.status(200).json(tokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get metadata for a specific book.
 */
export const getMetadata = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const metadata = await Book.getBookMetadata(book_id);
    return res.status(200).json(metadata);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all filters for books (note: "fliters" may be a typo, consider "filters").
 */
export const getBooksWithFlitter = async (req, res) => {
  try {
    const books = Book.getBooksWithFlitter(req.body);
    return res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadBook = async (req, res) => {
  try {
    const { id: book_id } = req.params;
    const { metadata, tokens } = req.body;
    console.log("Book upload request received:", book_id, metadata, tokens);
    await Token.addTokens(book_id, tokens);
    await Book.addBookMetadata(book_id, metadata);
    // Placeholder for book upload logic
    return res.status(200).json({ message: "Book uploaded successfully" });
  } catch (err) {
    console.error("Error uploading book:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Placeholder functions for adding book-related resources
export const addBookCategories = async (req, res) => {};
export const addBook = async (req, res) => {};
export const addBookTags = async (req, res) => {};
export const addBookAuthors = async (req, res) => {};
export const addBookTranslators = async (req, res) => {};
