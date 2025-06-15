/**
 * Model for handling OTP (One-Time Password) operations in the 'OTP' table.
 *
 * Methods:
 * - storeOTP(email, otp): Store or update an OTP for a user email.
 * - getOTP(email): Retrieve the OTP record for a user email.
 *
 * Dependencies:
 * - gumballPool: PostgreSQL connection pool for the Gumball database.
 */

import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class OTP {
  static #tableName = "OTP";
  static #columns = new Map([
    ["user_email", "temp_user_email"],
    ["code", "code"],
  ]);

  /**
   * Store or update an OTP for a user email.
   * If an OTP already exists for the email, it will be updated.
   */
  static async storeOTP(email, otp) {
    const query = `
      INSERT INTO ${this.#tableName} (${this.#columns.get("user_email")}, ${this.#columns.get("code")})
      VALUES ($1, $2)
      ON CONFLICT (${this.#columns.get("user_email")}) DO UPDATE 
      SET 
        ${this.#columns.get("code")} = $2
      RETURNING *;`;
    const values = [email, otp];
    const result = await gumballPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Retrieve the OTP record for a user email.
   */
  static async getOTP(email) {
    const query = `
        SELECT * FROM ${this.#tableName}
        WHERE ${this.#columns.get("user_email")} = $1`;
    const values = [email];
    const result = await gumballPool.query(query, values);
    return result.rows[0];
  }
}

export default OTP;
