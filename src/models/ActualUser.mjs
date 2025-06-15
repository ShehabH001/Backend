/**
 * Model for handling actual user operations in the 'res_partner' table.
 *
 * Methods:
 * - getUserById(user_id): Get user by ID.
 * - getUserByEmail(email): Get user by email.
 * - login(email, password, registration_type): Authenticate user.
 * - resetPassword(email, newPassword): Reset user's password.
 * - updateUser(user): Update user details.
 * - createUser(user): Create a new user.
 *
 * Dependencies:
 * - darwinPool: PostgreSQL connection pool for Darwin database.
 */

import pool from "../database/connection.mjs";
const darwinPool = pool.darwinPool;

class ActualUser {
  static #tableName = "res_partner";
  static #columns = new Map([
    ["id", "id"],
    ["name", "name"],
    ["email", "email"],
    ["country_code", "phone_code_selection"],
    ["mobile", "mobile"],
    ["password", "password"],
    ["registration_type", "registration_type"],
    ["customer_code", "customer_code"],
  ]);

  /**
   * Get user by ID.
   */
  static async getUserById(user_id) {
    const query = `SELECT * FROM ${this.#tableName} WHERE ${this.#columns.get(
      "id"
    )} = $1`;
    const values = [user_id];
    const result = await darwinPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get user by email.
   */
  static async getUserByEmail(email) {
    const query = `SELECT * FROM ${this.#tableName} WHERE ${this.#columns.get(
      "email"
    )} = $1`;
    const values = [email];
    const result = await darwinPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Authenticate user by email, password, and registration type.
   */
  static async login(email, password, registration_type) {
    const query = `SELECT * FROM ${this.#tableName} WHERE  ${this.#columns.get(
      "email"
    )} = $1 AND ( ${this.#columns.get("password")} = $2 OR ${this.#columns.get(
      "password"
    )} IS NULL) AND ${this.#columns.get("registration_type")} = $3`;
    const values = [email, password, registration_type];
    const result = await darwinPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Reset user's password.
   */
  static async resetPassword(email, newPassword) {
    const query = `UPDATE ${this.#tableName} SET ${this.#columns.get(
      "password"
    )} = $1 WHERE ${this.#columns.get("email")} = $2 RETURNING *`;
    const values = [newPassword, email];
    const result = await darwinPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update user details.
   */
  static async updateUser(user) {
    const query = `UPDATE ${this.#tableName} SET ${this.#columns.get(
      "name"
    )} = $1, ${this.#columns.get("email")} = $2, ${this.#columns.get(
      "country_code"
    )}= $3,
      ${this.#columns.get("mobile")} = $4 WHERE ${this.#columns.get(
      "id"
    )} = $5 RETURNING *`;
    const values = [
      user.name,
      user.email,
      user.country_code,
      user.mobile,
      user.id,
    ];
    const result = await darwinPool.query(query, values);
    return result.rows[0];
  }

  /**
   * Create a new user.
   */
  static async createUser(user) {
    const query = `
      INSERT INTO ${this.#tableName}
      (${this.#columns.get("name")}, ${this.#columns.get(
      "email"
    )}, ${this.#columns.get(
      "country_code"
    )}, ${this.#columns.get("mobile")},${this.#columns.get(
      "password"
    )} ,${this.#columns.get("registration_type")} , ${this.#columns.get(
      "customer_code"
    )})
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
      user.name,
      user.email,
      user.country_code,
      user.mobile,
      user.password,
      user.registration_type,
      "CUST-" + user.email.split("@")[0], // Example customer code generation
    ];

    const result = await darwinPool.query(query, values);
    return result.rows[0];
  }

  static async storeActualUserIfNotExists(user) {
    const existingUser = await this.getUserByEmail(user.email);
    if (existingUser) {
      return existingUser; // User already exists, return it
    }
    return this.createUser(user); // Create a new user if not exists
  }

    static async logout(user) {
    const query = `select * from ${this.#tableName} where ${this.#columns.get("email")} = $1`;
    const values = [user.email];
    const result = await darwinPool.query(query, values);
    if (result.rowCount === 0) {
      throw new Error("User not found");
    }
  }
}

export default ActualUser;
