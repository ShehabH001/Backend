import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class Annotation {
  static getUpdateQueryBody(tableName, columnName, updatedItems) {
    let query = `UPDATE ${tableName} SET ${columnName} = CASE`;
    for (let i = 0; i < updatedItems.length; i++) {
      query += ` WHEN id =  $${i * 2 + 1} THEN $${i * 2 + 2}`;
    }
    let idIndex = 1;
    query += ` ELSE ${columnName} 
          END
          WHERE id IN (`;
    for (let i = 0; i < updatedItems.length; i++) {
      query += `$${idIndex}, `;
      idIndex += 2;
    }
    query = query.slice(0, -2) + ")";
    return query;
  }

  static getDeleteQueryBody(tableName, deletedItems) {
    let query = `UPDATE ${tableName} SET is_deleted = true
          WHERE id IN (`;
    for (let i = 0; i < deletedItems.length; i++) {
      query += `$${i + 1}, `;
    }
    query = query.slice(0, -2) + ")";
    return query;
  }

  static async getAnnotationId(user_id, book_id) {
    const query = `
      INSERT INTO annotation (user_id, book_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, book_id) DO NOTHING
      RETURNING id;`
    const values = [user_id, book_id];
    const res = await gumballPool.query(query, values);
    const { id } = res.rows[0];
    return id;
  }
}

export default Annotation;
