import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

// Repositories are the data access layer.
// Controllers ask this file for data, and this file decides how to read/write it.
// Locally, this project uses a JSON file so the code is easy to inspect.
// On Vercel, set DATABASE_URL or POSTGRES_URL to use Postgres for real persistence.
// On Vercel without a database URL, it uses temporary memory storage so the demo still runs.

// ES modules do not automatically provide __dirname.
// These two lines recreate it so we can build a reliable path to data/tasks.json.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, "../../data/tasks.json");

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const usePostgres = Boolean(databaseUrl);
const useMemory = !usePostgres && Boolean(process.env.VERCEL);
const pool = usePostgres
  ? new pg.Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false }
    })
  : null;

let tableReady = false;
let postgresUnavailable = false;
let memoryTasks = [];

export function getStorageMode() {
  if (usePostgres && !postgresUnavailable) {
    return "postgres";
  }

  if (useMemory || postgresUnavailable) {
    return "memory-temporary";
  }

  return "json-file-local";
}

function markPostgresUnavailable(error) {
  postgresUnavailable = true;
  console.error("Postgres storage failed. Falling back to temporary memory storage.", error);
}

function rowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at
  };
}

async function ensureTasksTable() {
  if (!usePostgres || postgresUnavailable || tableReady) {
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        completed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      )
    `);
  } catch (error) {
    markPostgresUnavailable(error);
    return;
  }

  tableReady = true;
}

// Reads every task from the JSON file.
// In a real database project, this would be similar to SELECT * FROM tasks.
async function readTasks() {
  if (useMemory || postgresUnavailable) {
    return memoryTasks;
  }

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
  if (useMemory || postgresUnavailable) {
    memoryTasks = tasks;
    return;
  }

  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, JSON.stringify(tasks, null, 2));
}

// READ all tasks, with optional filters.
// Called by GET /api/tasks.
export async function findAll(filters = {}) {
  if (usePostgres && !postgresUnavailable) {
    await ensureTasksTable();

    if (postgresUnavailable) {
      return findAll(filters);
    }

    const conditions = [];
    const values = [];

    // Query params arrive as strings, so completed is "true" or "false", not a boolean.
    if (filters.completed === "true" || filters.completed === "false") {
      values.push(filters.completed === "true");
      conditions.push(`completed = $${values.length}`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);
      conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    try {
      const result = await pool.query(
        `SELECT * FROM tasks ${whereClause} ORDER BY created_at DESC`,
        values
      );

      return result.rows.map(rowToTask);
    } catch (error) {
      markPostgresUnavailable(error);
      return findAll(filters);
    }
  }

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
  if (usePostgres && !postgresUnavailable) {
    await ensureTasksTable();

    if (postgresUnavailable) {
      return findById(id);
    }

    try {
      const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
      return result.rows[0] ? rowToTask(result.rows[0]) : undefined;
    } catch (error) {
      markPostgresUnavailable(error);
      return findById(id);
    }
  }

  const tasks = await readTasks();
  return tasks.find((task) => task.id === id);
}

// CREATE one task.
// Called by POST /api/tasks.
export async function create(payload) {
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

  if (usePostgres && !postgresUnavailable) {
    await ensureTasksTable();

    if (postgresUnavailable) {
      const tasks = await readTasks();
      tasks.push(task);
      await writeTasks(tasks);
      return task;
    }

    try {
      const result = await pool.query(
        `
          INSERT INTO tasks (id, title, description, completed, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `,
        [task.id, task.title, task.description, task.completed, task.createdAt, task.updatedAt]
      );

      return rowToTask(result.rows[0]);
    } catch (error) {
      markPostgresUnavailable(error);
      const tasks = await readTasks();
      tasks.push(task);
      await writeTasks(tasks);
      return task;
    }
  }

  const tasks = await readTasks();
  tasks.push(task);
  await writeTasks(tasks);

  return task;
}

// UPDATE one task.
// Called by PUT /api/tasks/:id.
export async function update(id, payload) {
  if (usePostgres && !postgresUnavailable) {
    await ensureTasksTable();

    if (postgresUnavailable) {
      return update(id, payload);
    }

    try {
      const result = await pool.query(
        `
          UPDATE tasks
          SET title = $2,
              description = $3,
              completed = $4,
              updated_at = $5
          WHERE id = $1
          RETURNING *
        `,
        [
          id,
          payload.title.trim(),
          payload.description?.trim() || "",
          payload.completed,
          new Date().toISOString()
        ]
      );

      return result.rows[0] ? rowToTask(result.rows[0]) : null;
    } catch (error) {
      markPostgresUnavailable(error);
      return update(id, payload);
    }
  }

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
  if (usePostgres && !postgresUnavailable) {
    await ensureTasksTable();

    if (postgresUnavailable) {
      return remove(id);
    }

    try {
      const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
      return result.rowCount > 0;
    } catch (error) {
      markPostgresUnavailable(error);
      return remove(id);
    }
  }

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
