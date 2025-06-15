import Annotation from "./Annotation.mjs";
import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class Highlight extends Annotation {
  constructor() {
    super();
  }

  // to post(add, update, delete) highlights to the database
  static async highlights(user_id, book_id, requestBody) {
    let updatedHighlights = [];
    let deletedHighlights = [];
    let newHighlights = [];
    for (let i = 0; i < requestBody.length; i++) {
      if (requestBody[i].is_deleted === true) {
        deletedHighlights.push(requestBody[i]);
      } else if (requestBody[i].serverId) {
        updatedHighlights.push(requestBody[i]);
      } else {
        newHighlights.push(requestBody[i]);
      }
    }
    let isUpdated = false,
      isDeleted = false;
    let highlightsId = [];
    if (newHighlights.length > 0) {
      const res = await addHighlights(user_id, book_id, newHighlights);
      for (let i = 0; i < res.length; i++) {
        highlightsId.push({
          localId: newHighlights[i].id,
          serverId: res[i].id,
        });
      }
    }
    if (updatedHighlights.length > 0) {
      isUpdated = await updateHighlights(updatedHighlights);
    }
    if (deletedHighlights.length > 0) {
      isDeleted = await deleteHighlights(deletedHighlights);
    }
    return {
      ids: highlightsId,
      isUpdated: isUpdated,
      isDeleted: isDeleted,
    };
  }

  static async getHighlights(user_id, book_id, since) {
    try {
      const query = `
      SELECT * FROM 
        highlight 
      INNER JOIN 
        annotation 
      ON 
        highlight.annotation_id = annotation.id
      WHERE 
        annotation.user_id = $1 AND 
        annotation.book_id = $2 AND 
        highlight.updated_at > $3`;
      const values = [user_id, book_id, since];
      const result = await gumballPool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error fetching highlights:", error);
      throw new Error("Database query failed");
    }
  }

  static async addHighlights(user_id, book_id, highlights) {
    const annotationId = await super.getAnnotationId(user_id, book_id);
    let query = this.#getAddHighlightsQueryBody(highlights.length);
    let arr = [];
    for (let i = 0; i < highlights.length; i++) {
      arr.push(
        annotationId,
        highlights[i].start_index,
        highlights[i].end_index,
        highlights[i].text,
        highlights[i].page_number,
        highlights[i].chapter_number,
        highlights[i].color
      );
    }
    const result = await gumballPool.query(query, arr);
    return result.rows;
  }

  static async deleteHighlights(deletedHighlights) {
    const query = super.getDeleteQueryBody("highlight", deletedHighlights);
    let arr = [];
    for (let i = 0; i < deletedHighlights.length; i++) {
      arr.push(deletedHighlights[i].serverId);
    }
    const result = await gumballPool.query(query, arr);
    return result.rowCount > 0;
  }

  static async updateHighlights(updatedHighlights) {
    const query = super.getUpdateQueryBody(
      "highlight",
      "text",
      updatedHighlights
    );
    let arr = [];
    for (let i = 0; i < updatedHighlights.length; i++) {
      arr.push(updatedHighlights[i].serverId, updatedHighlights[i].text);
    }
    const result = await gumballPool.query(query, arr);
    return result.rowCount > 0;
  }

  static #getAddHighlightsQueryBody(bodyLenght) {
    let query =
      'INSERT INTO highlight (annotation_id, start_index, "end_index", text, page_number, chapter_number, color) VALUES ';
    for (let i = 0; i < bodyLenght; i++) {
      query += `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${
        i * 7 + 5
      }, $${i * 7 + 6} , $${i * 7 + 7}),`;
    }
    query = query.slice(0, -1) + " ";
    query += "RETURNING id";
    return query;
  }
}

export default Highlight;
