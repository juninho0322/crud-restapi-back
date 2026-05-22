import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import request from "supertest";

import app from "../src/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, "../data/tasks.json");

async function resetData() {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await writeFile(dataFile, "[]");
}

test("creates, lists, updates, and deletes a task", async () => {
  await resetData();

  const createResponse = await request(app)
    .post("/api/tasks")
    .send({ title: "Study CRUD", description: "Build the API" })
    .expect(201);

  const createdTask = createResponse.body.data;
  assert.equal(createdTask.title, "Study CRUD");
  assert.equal(createdTask.completed, false);

  const listResponse = await request(app).get("/api/tasks").expect(200);
  assert.equal(listResponse.body.count, 1);

  const updateResponse = await request(app)
    .put(`/api/tasks/${createdTask.id}`)
    .send({
      title: "Study REST",
      description: "Practice update endpoint",
      completed: true
    })
    .expect(200);

  assert.equal(updateResponse.body.data.completed, true);

  await request(app).delete(`/api/tasks/${createdTask.id}`).expect(204);

  const emptyListResponse = await request(app).get("/api/tasks").expect(200);
  assert.equal(emptyListResponse.body.count, 0);
});

test("validates required fields", async () => {
  await resetData();

  const response = await request(app).post("/api/tasks").send({ title: "" }).expect(400);

  assert.equal(response.body.message, "Title is required");
});
