/**
 * Database connection pool manager for PostgreSQL using the 'pg' library.
 * 
 * This module provides two separate connection pools:
 * - gumballPool: For the Gumball database.
 * - darwinPool: For the Darwin database.
 *
 * Environment Variables Required:
 * - GUMBALL_PG_HOST, GUMBALL_PG_PORT, GUMBALL_PG_USER, GUMBALL_PG_PASSWORD, GUMBALL_PG_DATABASE
 * - DARWIN_PG_HOST, DARWIN_PG_PORT, DARWIN_PG_USER, DARWIN_PG_PASSWORD, DARWIN_PG_DATABASE
 * - PG_CLIENTS_NUMBER, PG_IDLE_TIMEOUT, PG_CONNECTION_TIMEOUT
 *
 * Usage:
 *   import ConnectionPool from './database/connection.mjs';
 *   const client = await ConnectionPool.gumballPool.connect();
 *   // ... use client ...
 *   client.release();
 */

import pg from "pg"; // PostgreSQL client
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

class ConnectionPool {
  static gumballPool = new Pool({
    host: process.env.GUMBALL_PG_HOST,
    port: Number(process.env.GUMBALL_PG_PORT),
    user: process.env.GUMBALL_PG_USER,
    password: process.env.GUMBALL_PG_PASSWORD,
    database: process.env.GUMBALL_PG_DATABASE,
    max: Number(process.env.PG_CLIENTS_NUMBER), // Maximum number of clients in the pool
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT), // Close idle clients after timeout (ms)
    connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT), // Error after timeout (ms) if no connection is available
  });

  static darwinPool = new Pool({
    host: process.env.DARWIN_PG_HOST,
    port: Number(process.env.DARWIN_PG_PORT),
    user: process.env.DARWIN_PG_USER,
    password: process.env.DARWIN_PG_PASSWORD,
    database: process.env.DARWIN_PG_DATABASE,
    max: Number(process.env.PG_CLIENTS_NUMBER),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT),
    connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT),
  });
}

export default ConnectionPool;
