import type { NextFunction, Request, Response } from "express";

import {
  create,
  findAll,
  findById,
  remove,
  update
} from "../repositories/taskRepository.js";
import type { CreateTaskPayload, UpdateTaskPayload } from "../types/task.js";
import { validateCreateTask, validateUpdateTask } from "../validators/taskValidator.js";

// Controllers are the "traffic directors" of the API.
// They read HTTP data from req, call validators/repositories, and send HTTP responses.

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { completed, search } = req.query;
    const tasks = await findAll({
      completed: typeof completed === "string" ? completed : undefined,
      search: typeof search === "string" ? search : undefined
    });

    return res.json({
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await findById(String(req.params.id));

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ data: task });
  } catch (error) {
    return next(error);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as Partial<CreateTaskPayload>;
    const validationError = validateCreateTask(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const task = await create(payload as CreateTaskPayload);

    return res.status(201).json({ data: task });
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as Partial<UpdateTaskPayload>;
    const validationError = validateUpdateTask(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const task = await update(String(req.params.id), payload as UpdateTaskPayload);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ data: task });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await remove(String(req.params.id));

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
