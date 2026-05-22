# Study Plan

This plan is for learning backend and REST APIs using this project.

You already know frontend, so the best way to study is:

```text
start from the browser
follow the request into the backend
finish at the database
```

## The Whole Project In One Picture

```text
Browser UI
  src/client/index.html
  src/client/src/styles-app.css
  src/client/src/App.tsx

API Server
  src/server.ts
  src/app.ts
  src/routes/taskRoutes.ts
  src/controllers/taskController.ts
  src/validators/taskValidator.ts
  src/repositories/taskRepository.ts

Storage
  local: data/tasks.json
  deployed: Supabase Postgres

Deployment
  api/index.ts
  vercel.json
```

## What Talks To What

Read this top to bottom. This is the most important mental model.

```text
src/client/src/App.tsx
  talks to /api/tasks using fetch()

src/app.ts
  receives /api/tasks
  sends those requests to taskRoutes

src/routes/taskRoutes.ts
  chooses the correct controller based on method + URL

src/controllers/taskController.ts
  reads req
  calls validator if input must be checked
  calls repository for data
  sends res

src/validators/taskValidator.ts
  checks req.body

src/repositories/taskRepository.ts
  local: reads/writes data/tasks.json
  deployed: reads/writes Supabase Postgres

Supabase
  stores tasks permanently after deployment
```

## What Depends On What

Dependencies go in one direction:

```text
frontend
  -> HTTP API
    -> routes
      -> controllers
        -> validators
        -> repositories
          -> storage
```

Do not think of every file as equal. Each layer has a job.

```text
Frontend asks.
Route points.
Controller decides.
Validator protects.
Repository stores.
Database remembers.
```

## Phase 1: Run The Project

Goal: understand what the app does before reading code.

1. Run:

```bash
npm run dev
```

2. Open:

```text
http://localhost:3000
```

3. Create a task.
4. Edit the task.
5. Mark it done.
6. Delete it.
7. Watch the in-app panels:

```text
Last API call
Current code path
Frontend state
Endpoint map
```

Checkpoint:

You should be able to say:

```text
When I create a task, the browser sends POST /api/tasks.
```

## Phase 2: Start From The Frontend

Goal: connect your existing frontend knowledge to the API.

Open:

```text
src/client/src/App.tsx
```

Study these functions in order:

```text
apiRequest()
loadTasks()
saveTask()
renderTasks()
startEdit()
toggleTask()
deleteTask()
```

Important idea:

```text
apiRequest() is the bridge between frontend and backend.
```

Checkpoint:

Find this idea in code:

```js
fetch(url, options)
```

That is where browser code leaves the frontend world and enters the backend/API world.

## Phase 3: Learn Express App Setup

Goal: understand how requests enter the backend.

Open:

```text
src/server.ts
src/app.ts
```

`src/server.ts` starts the server locally.

`src/app.ts` builds the Express app.

Study these lines:

```js
app.use(express.json());
app.use(express.static(publicDirectory));
app.use("/api/tasks", taskRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
```

Meaning:

```text
express.json()
  makes req.body work

express.static()
  serves the frontend files

/api/tasks
  sends task API requests to taskRoutes

notFoundHandler
  handles unknown URLs

errorHandler
  handles unexpected errors
```

Checkpoint:

You should be able to say:

```text
src/app.ts connects middleware, frontend files, API routes, and error handlers.
```

## Phase 4: Learn Routes

Goal: understand how URL + HTTP method chooses code.

Open:

```text
src/routes/taskRoutes.ts
```

Study this map:

```text
GET    /api/tasks      -> listTasks
GET    /api/tasks/:id  -> getTaskById
POST   /api/tasks      -> createTask
PUT    /api/tasks/:id  -> updateTask
DELETE /api/tasks/:id  -> deleteTask
```

Frontend comparison:

```text
button click -> function
HTTP route   -> controller
```

Checkpoint:

You should be able to answer:

```text
Which function runs when the frontend sends DELETE /api/tasks/:id?
```

Answer:

```text
deleteTask
```

## Phase 5: Learn Controllers

Goal: understand request/response logic.

Open:

```text
src/controllers/taskController.ts
```

Study one function at a time:

```text
listTasks()
getTaskById()
createTask()
updateTask()
deleteTask()
```

Controllers use:

```text
req.query   data from ?completed=true
req.params  data from /api/tasks/:id
req.body    JSON body from POST/PUT
res         response back to client
next        sends errors to error middleware
```

Checkpoint:

In `createTask()`, find:

```text
validateCreateTask(req.body)
create(req.body)
res.status(201).json(...)
```

That is the controller pattern:

```text
validate -> do work -> respond
```

## Phase 6: Learn Validation

Goal: understand how backend protects itself from bad input.

Open:

```text
src/validators/taskValidator.ts
```

Study:

```text
validateCreateTask()
validateUpdateTask()
```

Important idea:

```text
Frontend validation is helpful.
Backend validation is required.
```

Why:

Anyone can call your API directly. They do not have to use your frontend.

Checkpoint:

Use curl or the frontend to try creating an empty title. The API should return:

```text
400 Bad Request
```

## Phase 7: Learn Repositories

Goal: understand the data layer.

Open:

```text
src/repositories/taskRepository.ts
```

Study these functions:

```text
findAll()
findById()
create()
update()
remove()
```

Important idea:

The controller does not care where data lives.

```text
Local:
  repository -> data/tasks.json

Vercel:
  repository -> Supabase Postgres
```

This is why the repository layer exists.

Checkpoint:

You should be able to say:

```text
If I change from JSON to Postgres, the controller functions can stay mostly the same.
```

## Phase 8: Learn Storage

Goal: understand local vs deployed data.

Local storage:

```text
data/tasks.json
```

Deployed storage:

```text
Supabase Postgres
```

Check deployed storage:

```text
https://YOUR-PROJECT.vercel.app/health
```

You want:

```json
{
  "storage": "postgres"
}
```

Checkpoint:

Create a task in the deployed frontend and confirm it appears in Supabase.

## Phase 9: Learn Tests

Goal: understand how to prove the API works.

Open:

```text
tests/tasks.test.ts
```

Run:

```bash
npm test
```

The test does this:

```text
create task
list tasks
update task
delete task
confirm list is empty
```

Checkpoint:

You should be able to say:

```text
The tests call the Express app without manually opening the browser.
```

## Phase 10: Learn Deployment

Goal: understand what Vercel changes.

Open:

```text
api/index.ts
vercel.json
docs/VERCEL_DEPLOY.md
```

Local:

```text
src/server.ts starts the server
```

Vercel:

```text
api/index.ts exports the Express app
```

Checkpoint:

You should be able to say:

```text
Vercel runs api/index.ts as a serverless function.
```

## Study Exercises

Do these in order.

### Exercise 1: Trace Create

Create a task and write down each file touched:

```text
src/client/src/App.tsx
src/app.ts
src/routes/taskRoutes.ts
src/controllers/taskController.ts
src/validators/taskValidator.ts
src/repositories/taskRepository.ts
data/tasks.json or Supabase
```

### Exercise 2: Add A Field

Add `priority` to tasks.

You will need to touch:

```text
src/client/index.html
src/client/src/App.tsx
src/validators/taskValidator.ts
src/repositories/taskRepository.ts
Supabase table
tests/tasks.test.ts
```

### Exercise 3: Add PATCH

Add:

```text
PATCH /api/tasks/:id
```

Purpose:

```text
update only one or two fields instead of replacing the whole task
```

### Exercise 4: Add Better Errors

Return clearer messages for:

```text
invalid title
task not found
database unavailable
```

### Exercise 5: Build A Second Resource

Create a `notes` resource using the same pattern:

```text
routes/noteRoutes.js
controllers/noteController.js
validators/noteValidator.js
repositories/noteRepository.js
```

This proves you understand the structure.

## Final Understanding Checklist

You understand this project when you can explain:

```text
What file starts the server locally?
What file starts the server on Vercel?
What file serves the frontend?
What file calls fetch()?
What file maps URLs to functions?
What file owns req/res logic?
What file validates input?
What file talks to storage?
What storage is used locally?
What storage is used on Vercel?
Why does the repository layer exist?
```

## Recommended Reading Order

Use this exact order:

```text
1. README.md
2. docs/STUDY_PLAN.md
3. src/client/src/App.tsx
4. src/app.ts
5. src/routes/taskRoutes.ts
6. src/controllers/taskController.ts
7. src/validators/taskValidator.ts
8. src/repositories/taskRepository.ts
9. tests/tasks.test.ts
10. docs/VERCEL_DEPLOY.md
```
