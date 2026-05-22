# Learning Roadmap

This project is a small REST API for studying backend fundamentals. The goal is not just to run it, but to understand how a request travels through the code.

## Big Picture

When a client sends a request, the flow is:

```text
Client
  -> src/server.ts
  -> src/app.ts
  -> src/client/index.html
  -> src/client/src/App.tsx
  -> src/routes/taskRoutes.ts
  -> src/controllers/taskController.ts
  -> src/validators/taskValidator.ts
  -> src/repositories/taskRepository.ts
  -> data/tasks.json
  -> response back to Client
```

The client can be a browser, Postman, curl, a frontend app, or tests.

In this project, the browser frontend lives in `src/client/`.

For a step-by-step study plan, start with `docs/STUDY_PLAN.md`.

For a frontend-only reading path, use `docs/FRONTEND_GUIDE.md`.

If you know frontend and are learning backend, start with `docs/BACKEND_FOR_FRONTEND_DEVS.md`.

For deployment, read `docs/VERCEL_DEPLOY.md`.

## Project Structure And Dependencies

The project is split by responsibility. This makes it easier to learn what depends on what.

```text
src/client/
  index.html             What the browser displays
  styles.css             How the browser page looks
  App.tsx                 Browser behavior and fetch() calls

src/
  server.ts              Opens the HTTP port
  App.tsx                 Creates the Express app

  routes/
    taskRoutes.ts        Maps URL + HTTP method to controller

  controllers/
    taskController.ts    Handles request/response logic

  validators/
    taskValidator.ts     Checks incoming data

  repositories/
    taskRepository.ts    Reads and writes task data

  middleware/
    notFoundHandler.ts   Handles unknown routes
    errorHandler.ts      Handles unexpected errors

data/
  tasks.json             Local JSON storage

api/
  index.ts               Vercel function entry point

tests/
  tasks.test.ts          Automated API checks
```

The dependency direction is:

```text
Browser UI
  -> API endpoint
  -> route
  -> controller
  -> validator
  -> repository
  -> data file locally or Postgres on Vercel
```

Files should not depend backward. For example, `taskRepository.ts` should not import `taskController.ts`.

## Who Talks To What

```text
src/client/src/App.tsx
  talks to src/app.ts through HTTP requests

src/app.ts
  talks to src/routes/taskRoutes.ts by mounting the router

src/routes/taskRoutes.ts
  talks to src/controllers/taskController.ts by calling controller functions

src/controllers/taskController.ts
  talks to src/validators/taskValidator.ts for input checks
  talks to src/repositories/taskRepository.ts for data

src/repositories/taskRepository.ts
  talks to data/tasks.json using the filesystem
```

## What Each Part Does

### `package.json`

Defines the project metadata, dependencies, and scripts.

Important scripts:

```bash
npm run dev
npm start
npm test
```

`npm run dev` uses `nodemon`, which restarts the server when files change.

### `src/server.ts`

Starts the HTTP server.

This file asks Express to listen on a port. It does not define routes directly. Its job is only to start the app.

### `src/app.ts`

Builds the Express application.

This is where global middleware is connected:

```js
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
```

It also connects routes:

```js
app.use("/api/tasks", taskRoutes);
```

That line means every task route starts with `/api/tasks`.

It also serves the frontend:

```js
app.use(express.static(publicDirectory));
```

That means `src/client/index.html`, `src/client/src/styles-app.css`, and `src/client/src/App.tsx` are available in the browser.

### `src/client/index.html`

Defines the visible page structure: form, task list, filters, and request log.

HTML answers the question: "What elements exist on the page?"

### `src/client/src/styles-app.css`

Controls the visual design: layout, colors, spacing, buttons, and responsive behavior.

CSS answers the question: "What should the page look like?"

### `src/client/src/App.tsx`

Controls browser behavior.

It listens for form submits and button clicks. Then it uses `fetch()` to call the backend API.

React + TypeScript answers the question: "What should happen when the user interacts?"

### `src/routes/taskRoutes.ts`

Maps HTTP methods and URLs to controller functions.

```text
GET    /api/tasks      -> listTasks
GET    /api/tasks/:id  -> getTaskById
POST   /api/tasks      -> createTask
PUT    /api/tasks/:id  -> updateTask
DELETE /api/tasks/:id  -> deleteTask
```

Routes should stay small. They decide where the request goes next.

### `src/controllers/taskController.ts`

Handles request and response logic.

Controllers read:

```js
req.params
req.query
req.body
```

Controllers send:

```js
res.json(...)
res.status(...).json(...)
res.status(204).send()
```

Controllers talk to validators and repositories.

### `src/validators/taskValidator.ts`

Checks whether incoming data is valid before saving it.

For example, a task must have a non-empty title. This avoids storing broken data.

### `src/repositories/taskRepository.ts`

Handles data storage.

Right now, the data is stored in:

```text
data/tasks.json
```

The rest of the app does not need to know if tasks are stored in JSON, PostgreSQL, MongoDB, or anything else. Only the repository needs to know that.

### `src/middleware/`

Middleware functions run during the request lifecycle.

`notFoundHandler.ts` handles unknown routes.

`errorHandler.ts` handles unexpected server errors.

### `tests/tasks.test.ts`

Tests the API automatically.

The tests use `supertest` to make fake HTTP requests against the Express app. This proves the CRUD behavior works without opening Postman manually.

## Core Backend Concepts

### Request

A request is what the client sends to the server.

Example:

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Study CRUD"
}
```

### Response

A response is what the server sends back.

Example:

```json
{
  "data": {
    "id": "generated-id",
    "title": "Study CRUD",
    "description": "",
    "completed": false
  }
}
```

### HTTP Methods

`GET` reads data.

`POST` creates data.

`PUT` updates data.

`DELETE` removes data.

### Status Codes

`200` means success.

`201` means created.

`204` means success with no response body.

`400` means the client sent invalid data.

`404` means something was not found.

`500` means unexpected server error.

## CRUD Breakdown

### Create

```text
POST /api/tasks
```

Flow:

```text
frontend form -> fetch POST -> route -> createTask controller -> validateCreateTask -> repository create -> JSON file
```

### Read All

```text
GET /api/tasks
```

Flow:

```text
frontend loadTasks -> fetch GET -> route -> listTasks controller -> repository findAll -> JSON file
```

### Read One

```text
GET /api/tasks/:id
```

Flow:

```text
route -> getTaskById controller -> repository findById -> JSON file
```

### Update

```text
PUT /api/tasks/:id
```

Flow:

```text
frontend edit/toggle -> fetch PUT -> route -> updateTask controller -> validateUpdateTask -> repository update -> JSON file
```

### Delete

```text
DELETE /api/tasks/:id
```

Flow:

```text
frontend delete button -> fetch DELETE -> route -> deleteTask controller -> repository remove -> JSON file
```

## Study Path

1. Start with `src/server.ts`.
2. Move to `src/app.ts` and understand middleware.
3. Open `src/client/index.html` and find the form and task list.
4. Open `src/client/src/App.tsx` and find `apiRequest()`.
5. Read `src/routes/taskRoutes.ts` and memorize route mapping.
6. Read one controller function at a time in `src/controllers/taskController.ts`.
7. Follow each controller into `src/repositories/taskRepository.ts`.
8. Run each endpoint with the visual frontend, curl, or Postman.
9. Change one small thing and run `npm test`.
10. Add a second resource, like `users`, using the same pattern.

## Practice Challenges

1. Add `priority` to every task.
2. Add a `PATCH /api/tasks/:id` endpoint for partial updates.
3. Add `GET /api/tasks?completed=false`.
4. Add validation so title cannot be longer than 100 characters.
5. Replace `data/tasks.json` with a real database later.

## Mental Model

Think of the layers like this:

```text
HTML says: "What can the user see?"
CSS says: "How should it look?"
Frontend React + TypeScript says: "What happens when the user clicks?"
Routes say: "Which controller should handle this URL?"
Controllers say: "What should happen for this request?"
Validators say: "Is this input allowed?"
Repositories say: "How do I save or load the data?"
Middleware says: "What should happen before or after routes?"
Tests say: "Does the whole behavior still work?"
```
