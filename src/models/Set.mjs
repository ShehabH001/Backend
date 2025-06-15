class Set {
  static async getAllSet(user_id) {
      const query = `
        SELECT * FROM 
            set
        WHERE 
            user_id = $1 `;
      const values = [user_id];
      const result = await db.query(query, values);
      return result.rows;
    
  }

  static async getSetBooks(user_id) {
      const query = `
            SELECT 
                set_content.book_id,
                set_content.created_at,
                set_content.updated_at,
            FROM 
                set_content
            INNER JOIN 
                set 
            ON 
                set_content.set_id = set.id
            WHERE 
                set.user_id = $1`;
      const values = [user_id];
      const result = await db.query(query, values);
      return result.rows;
  }

  static async addSet(user_id, set_name) {
      const query = `INSERT INTO set (user_id, name) VALUES ($1, $2);`;
      const values = [user_id, set_name];
      const result = await db.query(query, values);
      return result.rows[0];
   
  }

//   static async deleteSet(user_id, set_id) {
//       const query = `
//         UPDATE 
//             set 
//         SET 
//             is_deleted = TRUE
//         WHERE 
//             user_id = $1 AND set_id = $2;`;
//       const values = [user_id, set_id];
//       const result = await db.query(query, values);
//       return result.rowCount > 0;
  
//   }

  static async updateSet(user_id, id, new_name) {
      const query = `
        UPDATE set
        SET name = $1
        WHERE user_id = $2 AND id = $3;`;
      const values = [new_name, user_id, id];
      const result = await db.query(query, values);
      return result.rowCount > 0;
   
  }

  static async addBookToSet(set_id, book_id) {
      const query = `
        INSERT INTO set_content (set_id, book_id)
        VALUES ($1, $2);`;
      const values = [set_id, book_id];
      const result = await db.query(query, values);
      return result.rows[0];

  }

//   static async removeBookFromSet( set_id, book_id) {
//         const query = `
//             UPDATE set_content
//             SET is_deleted = TRUE
//             WHERE set_id = $1 AND book_id = $2;`;
//         const values = [set_id, book_id];
//         const result = await db.query(query, values);
//         return result.rowCount > 0;
   
//   }
}

export default Set;
