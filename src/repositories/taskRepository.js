import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Repositories are the data access layer.
// Controllers ask this file for data, and this file decides how to read/write it.
// Today the storage is a JSON file. Later you could replace this file with a database version.

// ES modules do not automatically provide __dirname.
// These two lines recreate it so we can build a reliable path to data/tasks.json.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, "../../data/tasks.json");

// Reads every task from the JSON file.
// In a real database project, this would be similar to SELECT * FROM tasks.
async function readTasks() {
  try {
    const content = await readFile(dataFile, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      // If the data file does not exist yet, treat it like an empty database.
      return [];
    }

    throw error;
  }
}

// Writes the complete task list back to the JSON file.
// This is simple for study, but a real database would update rows/documents directly.
async function writeTasks(tasks) {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, JSON.stringify(tasks, null, 2));
}

// READ all tasks, with optional filters.
// Called by GET /api/tasks.
export async function findAll(filters = {}) {
  const tasks = await readTasks();
  let filteredTasks = tasks;

  // Query params arrive as strings, so completed is "true" or "false", not a boolean.
  if (filters.completed === "true" || filters.completed === "false") {
    const completed = filters.completed === "true";
    filteredTasks = filteredTasks.filter((task) => task.completed === completed);
  }

  // Search checks whether the text appears inside the title or description.
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredTasks = filteredTasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    });
  }

  return filteredTasks;
}

// READ one task by ID.
// Called by GET /api/tasks/:id.
export async function findById(id) {
  const tasks = await readTasks();
  return tasks.find((task) => task.id === id);
}

// CREATE one task.
// Called by POST /api/tasks.
export async function create(payload) {
  const tasks = await readTasks();
  const now = new Date().toISOString();

  // This is the shape of one task object in the API.
  const task = {
    // randomUUID creates a unique ID like "2cc3b4...".
    id: randomUUID(),
    title: payload.title.trim(),
    description: payload.description?.trim() || "",
    completed: false,
    createdAt: now,
    updatedAt: now
  };

  tasks.push(task);
  await writeTasks(tasks);

  return task;
}

// UPDATE one task.
// Called by PUT /api/tasks/:id.
export async function update(id, payload) {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  const currentTask = tasks[taskIndex];
  const updatedTask = {
    // Keep fields that are not being changed, like id and createdAt.
    ...currentTask,
    title: payload.title.trim(),
    description: payload.description?.trim() || "",
    completed: payload.completed,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  await writeTasks(tasks);

  return updatedTask;
}

// DELETE one task.
// Called by DELETE /api/tasks/:id.
export async function remove(id) {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  // splice removes one item from the array at taskIndex.
  tasks.splice(taskIndex, 1);
  await writeTasks(tasks);

  return true;
}
