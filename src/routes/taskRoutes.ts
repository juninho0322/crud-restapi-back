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
// app.ts mounts this router at /api/tasks.
const router = Router();

router.get("/", listTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
