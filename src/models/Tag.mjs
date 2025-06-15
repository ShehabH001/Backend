import pool from "../database/connection.mjs";
import { validateCacheUtil } from "../utils/validateCache.mjs";
const darwinPool = pool.darwinPool;

//////////////////// Testing /////////////////

class Tag {
  static async validateCache(tag_ids, since) {
      return validateCacheUtil("tag", "id", "write_date", tag_ids, since);
  }

  static async getAllTags(limit, offset) {
      const query = `
      SELECT * FROM 
        tag 
      LIMIT $1 OFFSET $2`;
      const values = [limit, offset];
      const [rows] = await darwinPool.query(query, values);
      return rows;
    
  }

  static async getTagsByIds(tag_ids) {
      const query = `
      SELECT * FROM 
        tag 
      WHERE id = ANY($1)`;
      const values = [tag_ids];
      const { rows } = await darwinPool.query(query, values);
      return rows;
    
  }

  static async findById(tag_id) {
    const query = `SELECT * FROM tag WHERE id = $1 `;
    const values = [tag_id];
    const { rows } = await darwinPool.query(query, values);
    if (rows.length === 0) {
      throw new Error(`Tag with id ${tag_id} not found`);
    }
    return rows[0];
  }

   static async getBookTags(book_id) {
    const query = `
    SELECT * from 
      tag 
    JOIN 
      book_tag 
    ON 
      tag.id = book_tag.tag_id
    WHERE 
      book_tag.book_id = $1`;
    const values = [book_id];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  /////////////// until here /////////////////////////

  static async addTag(name) {
    const result = await darwinPool.query(
      `insert into tag (name) values ($1)`,
      [name]
    );
    return result.rowCount;
  }

  static async addTags(tags) {
    let queryBody = "insert into tag (name) values ";
    let values = [];
    for (let i = 0; i < tags.length; i++) {
      queryBody += `($${i + 1}),`;
      values.push(tags[i].name);
    }
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }

  static async updateTag(id, name) {
    const result = await darwinPool.query(
      `update tag set name = $1 where id = $2`,
      [name, id]
    );
    return result.rowCount;
  }

  static async deleteTag(id) {
    const result = await darwinPool.query(
      `Update tag set is_deleted = true where id = $1`,
      [id]
    );
    return result.rowCount;
  }

  static async addBookTags(bookId, tags) {
    let queryBody = "insert into book_tag (book_id,tag_id) values ";
    let values = [bookId];
    for (let i = 0; i < tags.length; i++) {
      queryBody += `($1, $${i + 2}),`;
      values.push(tags[i].tagId);
    }
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }

  static async removeBookTags(bookId, tags) {
    let queryBody = "delete from book_tag where book_id = $1 and tag_id = ANY($2)";
    let values = [bookId,tags];
    // for (let i = 0; i < tags.length; i++) {
    //   queryBody += `$${i + 2},`;
    //   values.push(tags[i].tagId);
    // }
    // queryBody = queryBody.slice(0, -1) + ")";
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }
}

export default Tag;
