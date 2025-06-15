/**
 * Utility function to validate cache consistency for a given table.
 *
 * Checks which items in a provided list of IDs have been updated since a given timestamp,
 * and which items have been deleted (i.e., no longer exist in the table).
 *
 * Dependencies:
 * - gumballPool, darwinPool: Database connection pools.
 *
 * @param {string} table_name - The name of the table to check.
 * @param {string} id_column_name - The name of the ID column in the table.
 * @param {string} update_column_name - The name of the column storing last update timestamps.
 * @param {Array} ids - The list of IDs to validate.
 * @param {string|Date} since - The timestamp to check updates against.
 * @returns {Promise<{updatedItems: Array, deletedItems: Array}>} An object containing arrays of updated and deleted item IDs.
 * @throws {Error} If a database error occurs.
 */
import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;
const darwinPool = pool.darwinPool;

export async function validateCacheUtil(
  table_name,
  id_column_name,
  update_column_name,
  ids,
  since
) {
  try {
    const updatedItemsQeury = `select ${id_column_name} from ${table_name} where ${update_column_name} > $1`;
    const updatedItemValues = [since];
    let { rows: updatedRows } = await darwinPool
      .query(updatedItemsQeury, updatedItemValues)
    updatedRows = updatedRows.map((row) => row[id_column_name]);
    const updatedItems = ids.filter((item) => updatedRows.includes(item));

    const deletedItemsQuery = `select ${id_column_name} from ${table_name} where ${id_column_name} = ANY($1)`;
    const deletedItemValues = [ids];
    let { rows: deletedRows } = await darwinPool
      .query(deletedItemsQuery, deletedItemValues)
    deletedRows = deletedRows.map((row) => row[id_column_name]);
    const deletedItems = ids.filter((item) => !deletedRows.includes(item));

    const responseBody = {
      updatedItems: updatedItems,
      deletedItems: deletedItems,
    };
    return responseBody;
  } catch (error) {
    console.error("Error validating cache:", error);
    throw new Error("Error validating cache");
  }
}