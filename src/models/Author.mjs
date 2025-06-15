import pool from "../database/connection.mjs";
const darwinPool = pool.darwinPool;
//////////////////// Testing /////////////////
class Author {
  static async validateCache(author_ids, since) {
      return validateCacheUtil("author", "id","write_date", author_ids, since);
  }

  static async getAllAuthors(limit, offset) {
    const query = `SELECT * FROM author limit $1 offset $2`;
    const values = [limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async getAuthorById(author_id) {
    const query = `SELECT * FROM author WHERE id = $1`;
    const values = [author_id];
    const { rows } = await darwinPool.query(query, values);
    return rows[0];
  }

  static async getBookAuthors(book_id) {
    const query = `SELECT * from author 
    JOIN author_product_template_rel ON author.id = author_product_template_rel.author_id
    WHERE author_product_template_rel.product_template_id = $1`;
    const values = [book_id];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  /////////////// until here /////////////////////////

  static async addAuthor(author) {
    const result = await darwinPool.query(
      `insert into author (name, image, bio) values ($1,$2,$3)`,
      [author.name, author.image, author.bio]
    );
    return result.rowCount;
  }

  static async addAuthors(authors) {
    let queryBody = "insert into author (name, image, bio) values ";
    let values = [];
    for (let i = 0; i < tags.length; i++) {
      queryBody += `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3},),`;
      values.push(authors[i].name, authors[i].image, authors[i].bio);
    }
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }

  static async updateAuthor(id, author) {
    const result = await darwinPool.query(
      `update author set name = $1, image = $2, bio = $3 where id = $4`,
      [author.name, author.image, author.bio, id]
    );
    return result.rowCount;
  }
  static async deleteAuthor(id) {
    const result = await darwinPool.query(
      `Update author set is_deleted = true where id = $1`,
      [id]
    );
    return result.rowCount;
  }

  

  static async addBookAuthors(bookId, authors) {
    let queryBody = "insert into author_product_template_rel (product_template_id,author_id) values ";
    let values = [bookId];
    for (let i = 0; i < authors.length; i++) {
      queryBody += `($1, $${i + 2}),`;
      values.push(authors[i].authorId);
    }
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }

  static async removeBookAuthors(bookId, authors) {
    let queryBody =
      "update author_product_template_rel set is_deleted = true where product_template_id = $1 and author_id in (";
    let values = [bookId];
    for (let i = 0; i < authors.length; i++) {
      queryBody += `$${i + 2},`;
      values.push(authors[i].authorId);
    }
    queryBody = queryBody.slice(0, -1) + ")";
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }
}

export default Author;
