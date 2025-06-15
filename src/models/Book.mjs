import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;
const darwinPool = pool.darwinPool;

//////////////////// Testing /////////////////

import Category from "../models/Category.mjs";
import Tag from "../models/Tag.mjs";
import Author from "../models/Author.mjs";
import Publisher from "../models/Publisher.mjs";
import Translator from "../models/Translator.mjs";
import { validateCacheUtil } from "../utils/validateCache.mjs";

class Book {
  static async validateCache(book_ids, since) {
    return validateCacheUtil(
      "product_template",
      "id",
      "write_date",
      book_ids,
      since
    );
  }

  static async getAllBooks(limit, offset) {
    const query = `
    SELECT id FROM product_template 
    LIMIT $1 OFFSET $2
    `;
    const values = [limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBookById(book_id) {
    const query = `SELECT * FROM product_template WHERE id = $1`;
    const values = [book_id];
    const { rows } = await darwinPool.query(query, values);
    return rows[0];
  }

  static async getBookByIds(book_ids) {
    const query = `SELECT * FROM product_template WHERE id = ANY($1)`;
    const values = [book_ids];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async findBookByName(book_name, limit, offset) {
    const query = `
    SELECT id
    FROM product_template
    WHERE EXISTS (
        SELECT 1
        FROM jsonb_each_text(name) AS j(key, value)
        WHERE value LIKE  $1
    ) 
    LIMIT $2 OFFSET $3`;
    const values = [`%${book_name}%`, limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async findBookByAuthorName(author_name, limit, offset) {
    const query = `
    SELECT id FROM product_template
    JOIN 
      author_product_template_rel ON product_template.id = author_product_template_rel.product_template_id
    JOIN 
      author on author.id = author_product_template_rel.author_id
    WHERE 
      author.name LIKE $1
    LIMIT $2 OFFSET $3`;
    const values = [`%${author_name}%`, limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBooksByTags(tag_id, limit, offset) {
    const query = `SELECT * from product_template 
    join book_tag on product_template.id = book_tag.book_id
    where book_tag.tag_id = $1
    LIMIT $2 OFFSET $3`;
    const values = [tag_id, limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBookByCategory(category_id, limit, offset) {
    const query = `SELECT * from product_template 
    join category_product_template_rel on product_template.id = category_product_template_rel.product_template_id
    where category_product_template_rel.category_id = $1
    LIMIT $2 OFFSET $3`;
    const values = [category_id, limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBookByAuthor(author_id, limit, offset) {
    const query = `SELECT * from product_template 
    JOIN author_product_template_rel ON product_template.id = author_product_template_rel.product_template_id
    WHERE author_product_template_rel.author_id = $1
    limit $2 offset $3`;
    const values = [author_id, limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBookMetadata(book_id) {
    const query = `SELECT * from book_metadata where book_id = $1`;
    const values = [book_id];
    const { rows } = await gumballPool.query(query, values);
    return rows;
  }

  static async getBookReviews(book_id) {
    const query = `SELECT * from review where book_id = $1`;
    const values = [book_id];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBookRating(book_id) {
    const query = `SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews from review where book_id = $1`;
    const values = [book_id];
    const { rows } = await darwinPool.query(query, values);
    return rows[0] || { average_rating: 0, total_reviews: 0 };
  }

  static async getSubData(id, since) {
    const bookCategories = await Category.getBookCategories(id, since);
    const bookTags = await Tag.getBookTags(id, since);
    const bookAuthors = await Author.getBookAuthors(id, since);
    const bookPublisher = await Publisher.getBookPublisher(id, since);
    const bookTranslator = await Translator.getBookTranslators(id, since);
    return {
      categories: bookCategories,
      tags: bookTags,
      authors: bookAuthors,
      publisher: bookPublisher,
      translator: bookTranslator,
    };
  }

  static async getBooksWithFlitter(request_body) {
    const { category_ids, tag_ids, author_ids, translator_ids, publisher_ids } =
      request_body;
    if (
      !category_ids &&
      !tag_ids &&
      !author_ids &&
      !translator_ids &&
      !publisher_ids
    ) {
      throw new Error("At least one filter must be provided");
    }
    const allCategories = await Category.getAllCategories();
    const allTags = await Tag.getAllTags();
    const allAuthors = await Author.getAllAuthors();
    const allTranslators = await Translator.getAllTranslators();
    const allPublishers = await Publisher.getAllPublishers();
    const query = `
    SELECT 
      id 
    FROM 
      product_template
    WHERE 
      id IN (SELECT book_id FROM category_product_template_rel WHERE category_id = ANY($1)) AND 
      id IN (SELECT book_id FROM book_tag WHERE tag_id = ANY($2)) AND 
      id IN (SELECT book_id FROM author_product_template_rel WHERE author_id = ANY($3)) AND 
      id IN (SELECT book_id FROM translator_product_template_rel WHERE translator_id = ANY($4)) AND 
      id IN (SELECT book_id FROM publisher_product_template_rel WHERE publisher_id = ANY($5))
    `;
    const values = [
      category_ids || allCategories.map((cat) => cat.id) || [],
      tag_ids || allTags.map((tag) => tag.id) || [],
      author_ids || allAuthors.map((author) => author.id) || [],
      translator_ids || allTranslators.map((translator) => translator.id) || [],
      publisher_ids || allPublishers.map((publisher) => publisher.id) || [],
    ];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBooksByPublisher(publisher_id, limit, offset) {
    const query = `select * from product_template where publisher_id = $1 limit $2 offset $3`;
    const values = [publisher_id, limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getBooksByTranslator(translator_id, limit, offset) {
    const query = `select * from product_template 
    join translator_product_template_rel on product_template.id = translator_product_template_rel.product_template_id
    where translator_product_template_rel.translator_id = $1
    limit $2 offset $3`;
    const values = [translator_id, limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  /////////////// until here /////////////////////////

  static async addBook(book, tokens) {}

  static async updateBook(id, book) {}

  static async deleteBook(id) {}

  static async getBookReadingProgress(userId, bookId) {}
}

export default Book;
