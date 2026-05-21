import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask
} from "../controllers/taskController.js";

// A router groups routes for one resource.
// Here the resource is "tasks".
// app.js mounts this router at /api/tasks.
const router = Router();

// READ all tasks:
// GET /api/tasks -> listTasks controller.
router.get("/", listTasks);

// READ one task:
// GET /api/tasks/:id -> getTaskById controller.
// :id is a route parameter and becomes req.params.id.
router.get("/:id", getTaskById);

// CREATE a task:
// POST /api/tasks -> createTask controller.
// The JSON body becomes req.body because app.js uses express.json().
router.post("/", createTask);

// UPDATE a task:
// PUT /api/tasks/:id -> updateTask controller.
// This project uses PUT as a full update: title, description, and completed.
router.put("/:id", updateTask);

// DELETE a task:
// DELETE /api/tasks/:id -> deleteTask controller.
router.delete("/:id", deleteTask);

export default router;
