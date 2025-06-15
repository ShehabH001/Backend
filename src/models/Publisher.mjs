import pool from "../database/connection.mjs";
const darwinPool = pool.darwinPool;

//////////////////// Testing /////////////////

class Publisher {
  static async validateCache(publisher_ids, since) {
      return validateCacheUtil("publisher", "id","write_date", publisher_ids, since);
  }

  static async getAllPublishers(limit, offset) {
    const query = `SELECT * FROM publisher LIMIT $1 OFFSET $2`;
    const values = [limit, offset];
    const result = await darwinPool.query(query,values);
    return result.rows;
  }

  static async getPublisherById(publisher_id) {
    const query = `SELECT * FROM publisher WHERE id = $1`;
    const values = [publisher_id];
    const { rows } = await darwinPool.query(query, values);
    return rows[0];
  }

  static async getBookPublisher(book_id) {
    const query = `
    SELECT * FROM 
      publisher 
    join 
      book 
    ON 
      publisher.id = book.publisher_id
    WHERE 
      book.id = $1`;
    const values = [book_id];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }
}

export default Publisher;
