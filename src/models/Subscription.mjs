import pool from "../database/connection.mjs";
const darwinPool = pool.darwinPool;

class Subscription {
  static async getAllSubscriptions() {
    const query = `SELECT * FROM stock_warehouse `;
    const { rows } = await darwinPool.query(query);
    return rows;
  }
}
