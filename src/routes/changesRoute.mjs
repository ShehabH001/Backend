/**
 * Change tracking routes for retrieving information about changes in various tables.
 *
 * Endpoints:
 * - GET /general: Retrieve general changes.
 * - GET /book-tables: Retrieve changes related to book tables.
 * - GET /user-tables: Retrieve changes related to user tables.
 * - GET /user-book-tables: Retrieve changes related to user-book tables.
 *
 * Dependencies:
 * - changesController: Controller functions for change tracking operations.
 *
 * Exports:
 * - router: Express Router instance with change-tracking related routes.
 */

import { Router } from "express";
import {
  bookTablesChanges,
  generalChanges,
  userBookTablesChanges,
  userTablesChanges,
} from "../controllers/changesController.mjs";

const router = Router();

router.get("/general", generalChanges); // Retrieve general changes
router.get("/book-tables", bookTablesChanges); // Retrieve book table changes
router.get("/user-tables", userTablesChanges); // Retrieve user table changes
router.get("/user-book-tables", userBookTablesChanges); // Retrieve user-book table changes

export default router;