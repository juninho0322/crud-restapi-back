import {
  create,
  findAll,
  findById,
  remove,
  update
} from "../repositories/taskRepository.js";
import { validateCreateTask, validateUpdateTask } from "../validators/taskValidator.js";

// Controllers are the "traffic directors" of the API.
// They read HTTP data from req, call validators/repositories, and send HTTP responses.
// They do not know how data is stored; that is the repository's job.

export async function listTasks(req, res, next) {
  try {
    // Query params come after ? in the URL.
    // Example: /api/tasks?completed=true&search=study
    const { completed, search } = req.query;
    const tasks = await findAll({ completed, search });

    // res.json sends JSON back to the client with status 200 by default.
    res.json({
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    // next(error) sends unexpected problems to errorHandler middleware.
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  try {
    // Route params come from the URL pattern /:id.
    // Example: /api/tasks/abc123 means req.params.id is "abc123".
    const task = await findById(req.params.id);

    if (!task) {
      // 404 means "the route exists, but this specific item was not found."
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ data: task });
  } catch (error) {
    return next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    // Validate before saving so bad data never reaches the repository.
    const validationError = validateCreateTask(req.body);

    if (validationError) {
      // 400 means "the client sent invalid data."
      return res.status(400).json({ message: validationError });
    }

    // The repository creates the ID, timestamps, and stores the task.
    const task = await create(req.body);

    // 201 means "created successfully."
    return res.status(201).json({ data: task });
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    // This endpoint expects the complete updated task body.
    const validationError = validateUpdateTask(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const task = await update(req.params.id, req.body);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ data: task });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    // remove returns true when it deleted something and false when the ID did not exist.
    const deleted = await remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 204 means "success, no response body."
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
