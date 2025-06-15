import Annotation from "./Annotation.mjs";
import pool from "../database/connection.mjs";
const gumballPool = pool.gumballPool;

class Note extends Annotation {
  constructor() {
    super();
  }

  static async notes(user_id, book_id, notes) {
    let updatedNotes = [];
    let deletedNotes = [];
    let newNotes = [];
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].is_deleted === true) {
        deletedNotes.push(notes[i]);
      } else if (notes[i].serverId) {
        updatedNotes.push(notes[i]);
      } else {
        newNotes.push(notes[i]);
      }
    }
    let isUpdated = false,
      isDeleted = false;
    let notesId = [];
    if (newNotes.length > 0) {
      const res = await addNotes(user_id, book_id, newNotes);
      for (let i = 0; i < res.length; i++) {
        notesId.push({ localId: newNotes[i].id, serverId: res[i].id });
      }
    }
    if (updatedNotes.length > 0) {
      isUpdated = await updateNotes(updatedNotes);
    }
    if (deletedNotes.length > 0) {
      isDeleted = await deleteNotes(deletedNotes);
    }
    return {
      ids: notesId,
      isUpdated: isUpdated,
      isDeleted: isDeleted,
    };
  }

  static async getNotes(user_id, book_id, since) {
    try {
      const query = `
      SELECT * FROM 
        note 
      INNER JOIN 
        annotation 
      ON 
        note.annotation_id = annotation.id
      WHERE 
        annotation.user_id = $1 AND 
        annotation.book_id = $2 AND 
        note.updated_at > $3`;
      const values = [user_id, book_id, since];
      const result = await gumballPool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new Error("Database query failed");
    }
  }

  static async addNotes(user_id, book_id, notes) {
    const inputId = await super.getAnnotationId(user_id, book_id);
    let query = this.#getAddNoteQueryBody(notes.length);
    let arr = [];
    for (let i = 0; i < notes.length; i++) {
      arr.push(
        inputId,
        notes[i].start,
        notes[i].end,
        notes[i].content,
        notes[i].page_number,
        notes[i].chapter_number
      );
    }
    const result = await gumballPool.query(query, arr);
    return result.rows;
  }

  static async deleteNotes(deletedNotes) {
    const query = super.getDeleteQueryBody("note", deletedNotes);
    let arr = [];
    for (let i = 0; i < deletedNotes.length; i++) {
      arr.push(deletedNotes[i].serverId);
    }
    const result = await gumballPool.query(query, arr);
    return result.rowCount > 0;
  }

  static async updateNotes(updatedNotes) {
    const query = super.getUpdateQueryBody("note", "content", updatedNotes);
    let arr = [];
    for (let i = 0; i < updatedNotes.length; i++) {
      arr.push(updatedNotes[i].serverId, updatedNotes[i].content);
    }
    const result = await gumballPool.query(query, arr);
    return result.rowCount > 0;
  }

  static #getAddNoteQueryBody(bodyLenght) {
    let query =
      'INSERT INTO note (annotation_id, start_index, "end_index", content, page_number, chapter_number) VALUES ';
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

export default Note;
