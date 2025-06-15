import Annotation from "./Annotation.mjs";
import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class Bookmark extends Annotation {
  constructor() {
    super();
  }

  static async bookmarks(user_id, book_id, bookmarks) {
    let updatedBookmarks = [];
    let deletedBookmarks = [];
    let newBookmarks = [];
    for (let i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].is_deleted === true) {
        deletedBookmarks.push(bookmarks[i]);
      } else if (bookmarks[i].serverId) {
        updatedBookmarks.push(bookmarks[i]);
      } else {
        newBookmarks.push(bookmarks[i]);
      }
    }
    let isUpdated = false,
      isDeleted = false;
    let bookmarksId = [];
    if (newBookmarks.length > 0) {
      const res = await addBookmarks(user_id, book_id, newBookmarks);
      for (let i = 0; i < res.length; i++) {
        bookmarksId.push({ localId: newBookmarks[i].id, serverId: res[i].id });
      }
    }
    if (updatedBookmarks.length > 0) {
      isUpdated = await updateBookmarks(updatedBookmarks);
    }
    if (deletedBookmarks.length > 0) {
      isDeleted = await deleteBookmarks(deletedBookmarks);
    }
    return {
      ids: bookmarksId,
      isUpdated: isUpdated,
      isDeleted: isDeleted,
    };
  }

  static async getBookmarks(user_id, book_id, since) {
    try {
      const query = `
      SELECT * FROM 
        bookmark 
      INNER JOIN 
        annotation 
      ON 
        bookmark.annotation_id = annotation.id
      WHERE 
        annotation.user_id = $1 AND 
        annotation.book_id = $2 AND 
        bookmark.updated_at > $3`;
      const values = [user_id, book_id, since];
      const result = await gumballPool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      throw new Error("Database query failed");
    }
  }

  static async addBookmarks(user_id, book_id, bookmarks) {
    const annotationId = await super.getAnnotationId(user_id, book_id);
    let query = this.#getAddBookmarkQueryBody(bookmarks.length);
    let arr = [];
    for (let i = 0; i < bookmarks.length; i++) {
      arr.push(
        annotationId,
        bookmarks[i].start_index,
        bookmarks[i].end_index,
        bookmarks[i].title,
        bookmarks[i].page_number,
        bookmarks[i].chapter_number
      );
    }
    const result = await gumballPool.query(query, arr);
    return result.rows;
  }

  static async deleteBookmarks(deletedBookmarks) {
    const query = super.getDeleteQueryBody("bookmark", deletedBookmarks);
    let arr = [];
    for (let i = 0; i < deletedBookmarks.length; i++) {
      arr.push(deletedBookmarks[i].serverId);
    }
    const result = await gumballPool.query(query, arr);
    return result.rowCount > 0;
  }

  static async updateBookmarks(updatedBookmarks) {
    const query = super.getUpdateQueryBody(
      "bookmark",
      "title",
      updatedBookmarks
    );
    let arr = [];
    for (let i = 0; i < updatedBookmarks.length; i++) {
      arr.push(updatedBookmarks[i].serverId, updatedBookmarks[i].title);
    }
    const result = await gumballPool.query(query, arr);
    return result.rowCount > 0;
  }

  static #getAddBookmarkQueryBody(bodyLenght) {
    let query =
      'INSERT INTO bookmark (annotation_id, start_index, "end_index", title, page_number, chapter_number) VALUES ';
    for (let i = 0; i < bodyLenght; i++) {
      query += `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${
        i * 6 + 5
      }, $${i * 6 + 6}),`;
    }
    query = query.slice(0, -1) + " ";
    query += "RETURNING id";
    return query;
  }
}

export default Bookmark;
