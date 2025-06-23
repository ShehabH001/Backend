import pool from "../database/connection.mjs";
const darwinPool = pool.darwinPool;

class Subscription {
  static async getAllSubscriptions() {
    const query = `SELECT * FROM stock_warehouse `;
    const { rows } = await darwinPool.query(query);
    return rows;
  }

  static async getSubscriptionBooks(Subscription_id, limit, offset){
    const query = `
    select from 
      product_template 
    inner join 
      product_template_stock_warehouse_rel 
    on 
      product_template_stock_warehouse_rel.product_template_id = product_template.id
    where 
      product_template_stock_warehouse_rel.stock_warehouse_id = $1
    LIMIT $2 OFFSET $3 `
    const values = [Subscription_id, limit, offset]
    const {rows} = await darwinPool.query(query,values)
    return rows
  }
}
