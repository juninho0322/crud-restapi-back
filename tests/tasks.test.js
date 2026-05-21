import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

import request from "supertest";

import app from "../src/app.js";

// Tests call the Express app directly.
// That means we can test the API without manually starting localhost:3000.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, "../data/tasks.json");

// Each test starts from an empty JSON database.
// This keeps tests independent from each other.
async function resetData() {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, "[]");
}

test("creates, lists, updates, and deletes a task", async () => {
  await resetData();

  // CREATE: send JSON to POST /api/tasks and expect HTTP 201.
  const createResponse = await request(app)
    .post("/api/tasks")
    .send({ title: "Study CRUD", description: "Build the API" })
    .expect(201);

  const createdTask = createResponse.body.data;
  assert.equal(createdTask.title, "Study CRUD");
  assert.equal(createdTask.completed, false);

  // READ all: after creating one task, the API should return count 1.
  const listResponse = await request(app).get("/api/tasks").expect(200);
  assert.equal(listResponse.body.count, 1);

  // UPDATE: send the new full task data to PUT /api/tasks/:id.
  const updateResponse = await request(app)
    .put(`/api/tasks/${createdTask.id}`)
    .send({
      title: "Study REST",
      description: "Practice update endpoint",
      completed: true
    })
    .expect(200);

  assert.equal(updateResponse.body.data.completed, true);

  // DELETE: remove the task by ID.
  await request(app).delete(`/api/tasks/${createdTask.id}`).expect(204);

  // READ all again: after deleting, the list should be empty.
  const emptyListResponse = await request(app).get("/api/tasks").expect(200);
  assert.equal(emptyListResponse.body.count, 0);
});

test("validates required fields", async () => {
  await resetData();

  // Validation test: empty title should fail before anything is saved.
  const response = await request(app).post("/api/tasks").send({ title: "" }).expect(400);

  assert.equal(response.body.message, "Title is required");
});
