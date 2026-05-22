# Learning Roadmap

This project is a small REST API for studying backend fundamentals. The goal is not just to run it, but to understand how a request travels through the code.

## Big Picture

When a client sends a request, the flow is:

```text
Client
  -> src/server.js
  -> src/app.js
  -> public/index.html
  -> public/app.js
  -> src/routes/taskRoutes.js
  -> src/controllers/taskController.js
  -> src/validators/taskValidator.js
  -> src/repositories/taskRepository.js
  -> data/tasks.json
  -> response back to Client
```

The client can be a browser, Postman, curl, a frontend app, or tests.

In this project, the browser frontend lives in `public/`.

For a frontend-only reading path, use `docs/FRONTEND_GUIDE.md`.

If you know frontend and are learning backend, start with `docs/BACKEND_FOR_FRONTEND_DEVS.md`.

For deployment, read `docs/VERCEL_DEPLOY.md`.

## Project Structure And Dependencies

The project is split by responsibility. This makes it easier to learn what depends on what.

```text
public/
  index.html             What the browser displays
  styles.css             How the browser page looks
  app.js                 Browser behavior and fetch() calls

src/
  server.js              Opens the HTTP port
  app.js                 Creates the Express app

  routes/
    taskRoutes.js        Maps URL + HTTP method to controller

  controllers/
    taskController.js    Handles request/response logic

  validators/
    taskValidator.js     Checks incoming data

  repositories/
    taskRepository.js    Reads and writes task data

  middleware/
    notFoundHandler.js   Handles unknown routes
    errorHandler.js      Handles unexpected errors

data/
  tasks.json             Local JSON storage

api/
  index.js               Vercel function entry point

tests/
  tasks.test.js          Automated API checks
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

Files should not depend backward. For example, `taskRepository.js` should not import `taskController.js`.

## Who Talks To What

```text
public/app.js
  talks to src/app.js through HTTP requests

src/app.js
  talks to src/routes/taskRoutes.js by mounting the router

src/routes/taskRoutes.js
  talks to src/controllers/taskController.js by calling controller functions

src/controllers/taskController.js
  talks to src/validators/taskValidator.js for input checks
  talks to src/repositories/taskRepository.js for data

src/repositories/taskRepository.js
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

### `src/server.js`

Starts the HTTP server.

This file asks Express to listen on a port. It does not define routes directly. Its job is only to start the app.

### `src/app.js`

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

That means `public/index.html`, `public/styles.css`, and `public/app.js` are available in the browser.

### `public/index.html`

Defines the visible page structure: form, task list, filters, and request log.

HTML answers the question: "What elements exist on the page?"

### `public/styles.css`

Controls the visual design: layout, colors, spacing, buttons, and responsive behavior.

CSS answers the question: "What should the page look like?"

### `public/app.js`

Controls browser behavior.

It listens for form submits and button clicks. Then it uses `fetch()` to call the backend API.

JavaScript answers the question: "What should happen when the user interacts?"

### `src/routes/taskRoutes.js`

Maps HTTP methods and URLs to controller functions.

```text
GET    /api/tasks      -> listTasks
GET    /api/tasks/:id  -> getTaskById
POST   /api/tasks      -> createTask
PUT    /api/tasks/:id  -> updateTask
DELETE /api/tasks/:id  -> deleteTask
```

Routes should stay small. They decide where the request goes next.

### `src/controllers/taskController.js`

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

### `src/validators/taskValidator.js`

Checks whether incoming data is valid before saving it.

For example, a task must have a non-empty title. This avoids storing broken data.

### `src/repositories/taskRepository.js`

Handles data storage.

Right now, the data is stored in:

```text
data/tasks.json
```

The rest of the app does not need to know if tasks are stored in JSON, PostgreSQL, MongoDB, or anything else. Only the repository needs to know that.

### `src/middleware/`

Middleware functions run during the request lifecycle.

`notFoundHandler.js` handles unknown routes.

`errorHandler.js` handles unexpected server errors.

### `tests/tasks.test.js`

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

1. Start with `src/server.js`.
2. Move to `src/app.js` and understand middleware.
3. Open `public/index.html` and find the form and task list.
4. Open `public/app.js` and find `apiRequest()`.
5. Read `src/routes/taskRoutes.js` and memorize route mapping.
6. Read one controller function at a time in `src/controllers/taskController.js`.
7. Follow each controller into `src/repositories/taskRepository.js`.
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
Frontend JavaScript says: "What happens when the user clicks?"
Routes say: "Which controller should handle this URL?"
Controllers say: "What should happen for this request?"
Validators say: "Is this input allowed?"
Repositories say: "How do I save or load the data?"
Middleware says: "What should happen before or after routes?"
Tests say: "Does the whole behavior still work?"
```
