/**
 * Model for handling temporary user operations in the 'temp_user' table.
 *
 * Methods:
 * - getUserByEmail(email): Get a temporary user by email.
 * - storeUser(user): Create or update a temporary user.
 * - deleteUserByEmail(email): Delete a temporary user by email.
 *
 * Dependencies:
 * - gumballPool: PostgreSQL connection pool for the Gumball database.
 */

import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class TempUser {
  static #tableName = "temp_user";
  static #columns = new Map([
    ["name", "name"],
    ["email", "email"],
    ["country_code", "country_code"],
    ["phone", "phone"],
    ["password", "password"],
    ["registration_type", "registration_type"],
  ]);

  /**
   * Get a temporary user by email.
   */
  static async getUserByEmail(email) {
    const query = `SELECT * FROM ${this.#tableName} WHERE ${this.#columns.get("email")} = $1`;
    const values = [email];
    const result = await gumballPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Create or update a temporary user.
   * If a user with the same email already exists, it updates the existing user.
   */
  static async storeUser(user) {
    const query = `
      INSERT INTO ${this.#tableName}
      (${this.#columns.get("name")}, ${this.#columns.get("email")}, ${this.#columns.get("country_code")},
       ${this.#columns.get("phone")}, ${this.#columns.get("password")}, ${this.#columns.get("registration_type")})
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (${this.#columns.get("email")}) DO UPDATE 
      SET ${this.#columns.get("name")} = $1, ${this.#columns.get("country_code")} = $3,
          ${this.#columns.get("phone")} = $4, ${this.#columns.get("password")} = $5,
          ${this.#columns.get("registration_type")} = $6
      RETURNING *;`;
    const values = [
      user.name,
      user.email,
      user.country_code,
      user.phone,
      user.password,
      user.registration_type,
    ];

    const result = await gumballPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a temporary user by email.
   */
  static async deleteUserByEmail(email) {
    const query = `DELETE FROM ${this.#tableName} WHERE ${this.#columns.get("email")} = $1 RETURNING *`;
    const values = [email];
    const result = await gumballPool.query(query, values);
    return result.rows[0];
  }
}

export default TempUser;
