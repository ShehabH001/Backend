import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class Token {
  static async addTokens(book_id, tokens) {
    let queryBody = `INSERT INTO token (
            book_id,
            content,
            sequence,
            size,
            start_page,
            end_page,
            start_chapter,
            end_chapter
            ) VALUES `;
    let values = [];
    for (let i = 0; i < tokens.length; i++) {
      queryBody += `( $${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${
        i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8}), `;
      values.push(
        Number(book_id),
        tokens[i].content,
        tokens[i].sequence,
        tokens[i].size,
        tokens[i].start_page,
        tokens[i].end_page,
        tokens[i].start_chapter,
        tokens[i].end_chapter
      );
    }
    queryBody = queryBody.slice(0, -2) + ";";
    console.log("Query Body:", queryBody);
    console.log("Values:", values);
    const result = await gumballPool.query(queryBody, values);
    return result.rowCount;
  }

  static async getToken(book_id, token_sequence) {
    const query = `SELECT * FROM token WHERE book_id = $1 AND sequence = $2`;
    const values = [book_id, token_sequence];
    const { rows } = await gumballPool.query(query, values);
    return rows[0];
  }

  static async deleteToken(book_id, token_id) {
    const result = await gumballPool.query(
      `UPDATE token SET is_deleted = TRUE WHERE book_id = $1 AND id = $2`,
      [book_id, token_id]
    );
    return result.rowCount;
  }

  static async updateToken(book_id, token_id, token) {
    const result = await gumballPool.query(
      `UPDATE token SET content = $1, sequence = $2, size = $3, start_page = $4, end_page = $5, start_chapter = $6, end_chapter = $7 WHERE book_id = $8 AND id = $9`,
      [
        token.content,
        token.sequence,
        token.size,
        token.start_page,
        token.end_page,
        token.start_chapter,
        token.end_chapter,
        book_id,
        id,
      ]
    );
    return result.rowCount;
  }

  static async getTokens(book_id) {
    const { rows } = await gumballPool.query(
      `SELECT * FROM token WHERE book_id = $1`,
      [book_id]
    );
    return rows;
  }
}

export default Token;
