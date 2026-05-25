import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
const dataFile = path.resolve(process.env.DATA_FILE_PATH ?? path.join(process.cwd(), "data/tasks.json"));
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const usePostgres = Boolean(databaseUrl);
const useMemory = !usePostgres && Boolean(process.env.VERCEL);
const pool = usePostgres
    ? new pg.Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl?.includes("localhost") ? false : { rejectUnauthorized: false }
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
export async function getStorageStatus() {
    if (usePostgres && !postgresUnavailable) {
        await ensureTasksTable();
    }
    const mode = getStorageMode();
    const notes = {
        postgres: "Connected to Postgres. Tasks should persist in Supabase.",
        "memory-temporary": "Using temporary memory. Check DATABASE_URL/POSTGRES_URL if you expected Supabase.",
        "json-file-local": "Using local data/tasks.json. This is expected for local development."
    };
    return {
        mode,
        note: notes[mode]
    };
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
    if (!pool || !usePostgres || postgresUnavailable || tableReady) {
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
    }
    catch (error) {
        markPostgresUnavailable(error);
        return;
    }
    tableReady = true;
}
async function readTasks() {
    if (useMemory || postgresUnavailable) {
        return memoryTasks;
    }
    try {
        const content = await readFile(dataFile, "utf8");
        return JSON.parse(content);
    }
    catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
}
async function writeTasks(tasks) {
    if (useMemory || postgresUnavailable) {
        memoryTasks = tasks;
        return;
    }
    await mkdir(path.dirname(dataFile), { recursive: true });
    await writeFile(dataFile, JSON.stringify(tasks, null, 2));
}
export async function findAll(filters = {}) {
    if (pool && usePostgres && !postgresUnavailable) {
        await ensureTasksTable();
        if (postgresUnavailable) {
            return findAll(filters);
        }
        const conditions = [];
        const values = [];
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
            const result = await pool.query(`SELECT * FROM tasks ${whereClause} ORDER BY created_at DESC`, values);
            return result.rows.map(rowToTask);
        }
        catch (error) {
            markPostgresUnavailable(error);
            return findAll(filters);
        }
    }
    const tasks = await readTasks();
    let filteredTasks = tasks;
    if (filters.completed === "true" || filters.completed === "false") {
        const completed = filters.completed === "true";
        filteredTasks = filteredTasks.filter((task) => task.completed === completed);
    }
    if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter((task) => {
            return (task.title.toLowerCase().includes(search) ||
                task.description.toLowerCase().includes(search));
        });
    }
    return filteredTasks;
}
export async function findById(id) {
    if (pool && usePostgres && !postgresUnavailable) {
        await ensureTasksTable();
        if (postgresUnavailable) {
            return findById(id);
        }
        try {
            const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
            return result.rows[0] ? rowToTask(result.rows[0]) : undefined;
        }
        catch (error) {
            markPostgresUnavailable(error);
            return findById(id);
        }
    }
    const tasks = await readTasks();
    return tasks.find((task) => task.id === id);
}
export async function create(payload) {
    const now = new Date().toISOString();
    const task = {
        id: randomUUID(),
        title: payload.title.trim(),
        description: payload.description?.trim() || "",
        completed: false,
        createdAt: now,
        updatedAt: now
    };
    if (pool && usePostgres && !postgresUnavailable) {
        await ensureTasksTable();
        if (postgresUnavailable) {
            const tasks = await readTasks();
            tasks.push(task);
            await writeTasks(tasks);
            return task;
        }
        try {
            const result = await pool.query(`
          INSERT INTO tasks (id, title, description, completed, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [task.id, task.title, task.description, task.completed, task.createdAt, task.updatedAt]);
            return rowToTask(result.rows[0]);
        }
        catch (error) {
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
export async function update(id, payload) {
    if (pool && usePostgres && !postgresUnavailable) {
        await ensureTasksTable();
        if (postgresUnavailable) {
            return update(id, payload);
        }
        try {
            const result = await pool.query(`
          UPDATE tasks
          SET title = $2,
              description = $3,
              completed = $4,
              updated_at = $5
          WHERE id = $1
          RETURNING *
        `, [
                id,
                payload.title.trim(),
                payload.description?.trim() || "",
                payload.completed,
                new Date().toISOString()
            ]);
            return result.rows[0] ? rowToTask(result.rows[0]) : null;
        }
        catch (error) {
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
export async function remove(id) {
    if (pool && usePostgres && !postgresUnavailable) {
        await ensureTasksTable();
        if (postgresUnavailable) {
            return remove(id);
        }
        try {
            const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
            return (result.rowCount ?? 0) > 0;
        }
        catch (error) {
            markPostgresUnavailable(error);
            return remove(id);
        }
    }
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
        return false;
    }
    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);
    return true;
}
