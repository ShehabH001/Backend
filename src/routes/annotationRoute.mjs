/**
 * Annotation routes for handling book annotations, highlights, bookmarks, and notes.
 *
 * Endpoints:
 * - POST /sync-highlights: Sync highlights (add, update, delete) for a book.
 * - POST /sync-bookmarks: Sync bookmarks (add, update, delete) for a book.
 * - POST /sync-notes: Sync notes (add, update, delete) for a book.
 *
 * POST Body Structure (for /sync-highlights, /sync-bookmarks, /sync-notes):
 * {
 *   items: [
 *     {
 *       id: string,           // Local ID (for new items)
 *       serverId: string,     // Server ID (for existing items)
 *       is_deleted: boolean,  // true if item should be deleted
 *       ...other fields...
 *     },
 *     ...
 *   ]
 * }
 * The server will separate items into new, updated, and deleted based on:
 * - is_deleted === true   → deleted
 * - serverId exists       → updated
 * - else                  → new
 *
 * Dependencies:
 * - annotationController: Controller functions for annotation operations.
 *
 * Exports:
 * - router: Express Router instance with annotation-related routes.
 */

import { Router } from "express";
const router = Router();
import {
  getBookAnnotations,
  getBookHighlights,
  getBookBookmarks,
  getBookNotes,
  syncBookHighlights,
  syncBookBookmarks,
  syncBookNotes,
} from "../controllers/annotationController.mjs";

router.get("", getBookAnnotations);
router.get("/highlights", getBookHighlights);
router.get("/bookmarks", getBookBookmarks);
router.get("/notes", getBookNotes);

// Updated sync endpoints
router.post("/sync-highlights", syncBookHighlights);
router.post("/sync-bookmarks", syncBookBookmarks);
router.post("/sync-notes", syncBookNotes);

export default router;