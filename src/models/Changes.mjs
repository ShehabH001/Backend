import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class Changes {
  static async getGeneralChanges(since) {
    const query = `SELECT * FROM  changes_of_general_tables WHERE updated_at >= $1`;
    const values = [since];
    const { rows } = await gumballPool.query(query, values);
    return rows;
  }

  static async getBookTablesChanges(since, book_id) {
    const query = `SELECT * FROM  changes_of_book_tables WHERE updated_at >= $1 AND book_id = $2`;
    const values = [since, book_id];
    const { rows } = await gumballPool.query(query, values);
    return rows;
  }

  static async getUserTablesChanges(since, user_id) {
    const query = `SELECT * FROM  changes_of_user_tables WHERE updated_at >= $1 AND user_id = $2`;
    const values = [since, user_id];
    const { rows } = await gumballPool.query(query, values);
    return rows;
  }

  static async getUserBookTablesChanges(since, book_id, user_id) {
    const query = `SELECT * FROM  changes_of_user_book_tables WHERE updated_at >= $1 AND book_id = $2 AND user_id = $3`;
    const values = [since, book_id, user_id];
    const { rows } = await gumballPool.query(query, values);
    return rows;
  }
}

export default Changes;
