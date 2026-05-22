import { create, findAll, findById, remove, update } from "../repositories/taskRepository.js";
import { validateCreateTask, validateUpdateTask } from "../validators/taskValidator.js";
// Controllers are the "traffic directors" of the API.
// They read HTTP data from req, call validators/repositories, and send HTTP responses.
export async function listTasks(req, res, next) {
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
    }
    catch (error) {
        return next(error);
    }
}
export async function getTaskById(req, res, next) {
    try {
        const task = await findById(String(req.params.id));
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.json({ data: task });
    }
    catch (error) {
        return next(error);
    }
}
export async function createTask(req, res, next) {
    try {
        const payload = req.body;
        const validationError = validateCreateTask(payload);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const task = await create(payload);
        return res.status(201).json({ data: task });
    }
    catch (error) {
        return next(error);
    }
}
export async function updateTask(req, res, next) {
    try {
        const payload = req.body;
        const validationError = validateUpdateTask(payload);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const task = await update(String(req.params.id), payload);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.json({ data: task });
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteTask(req, res, next) {
    try {
        const deleted = await remove(String(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
