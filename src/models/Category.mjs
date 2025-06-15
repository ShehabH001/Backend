import pool from "../database/connection.mjs";
import { validateCacheUtil } from "../utils/validateCache.mjs";
const darwinPool = pool.darwinPool;

//////////////////// Testing /////////////////

class Category {
  static async validateCache(category_ids, since) {
      return validateCacheUtil("category", "id", "write_date", category_ids, since);
  }
  static async getAllCategories(limit, offset) {
    const query = `SELECT * FROM category 
       limit $1 offset $2`;
    const values = [limit, offset];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  static async findById(category_id) {
    const query = `SELECT * FROM category WHERE id = $1`;
    const values = [category_id];
    const { rows } = await darwinPool.query(query, values);
    return rows[0];
  }

  static async getBookCategories(book_id) {
    const query = `
    SELECT * from category 
    JOIN category_product_template_rel ON category.id = category_product_template_rel.category_id
    WHERE category_product_template_rel.product_template_id = $1`;
    const values = [book_id];
    const { rows } = await darwinPool.query(query, values);
    return rows;
  }

  ///////////////// until here /////////////////////////

  static async addCategory(category) {
    const result = await darwinPool.query(
      `insert into category (name,image) values ($1,$2)`,
      [category.name, category.image]
    );
    return result.rowCount;
  }

  static async addCategories(categories) {
    let queryBody = "insert into category (name,image) values ";
    let values = [];
    for (let i = 0; i < tags.length; i++) {
      queryBody += `($${i * 2 + 1},$${i * 2 + 2}),`;
      values.push(categories[i].name);
      values.push(categories[i].image);
    }
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }

  static async updateCategory(newCateogry) {
    const result = await darwinPool.query(
      `update category set name = $1, image = $2 where id = $3`,
      [newCateogry.name, newCateogry.image, newCateogry.id]
    );
    return result.rowCount;
  }

  static async deleteCategory(id) {
    const result = await darwinPool.query(
      `Update category set is_deleted = true where id = $1`,
      [id]
    );
    return result.rowCount;
  }

  static async addBookCategories(bookId, categories) {
    let queryBody = "insert into category_product_template_rel (book_id,category_id) values ";
    let values = [bookId];
    for (let i = 0; i < tags.length; i++) {
      queryBody += `($1, $${i + 2}),`;
      values.push(categories[i].categoryId);
    }
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }

  static async removeBookCategories(bookId, tags) {
    let queryBody =
      "update category_product_template_rel set is_deleted = true where book_id = $1 and category_id in (";
    let values = [bookId];
    for (let i = 0; i < tags.length; i++) {
      queryBody += `$${i + 2},`;
      values.push(tags[i].tagId);
    }
    queryBody = queryBody.slice(0, -1) + ")";
    const result = await darwinPool.query(queryBody, values);
    return result.rowCount;
  }
}

export default Category;
