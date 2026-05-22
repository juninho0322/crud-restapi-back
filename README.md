# CRUD Study REST API

Small backend project for studying CRUD with Node.js and Express.

The API manages `tasks` and stores them in a local JSON file at `data/tasks.json`.

## Learning guide

Start here:

1. Read [docs/ROADMAP.md](docs/ROADMAP.md).
2. Read [docs/BACKEND_FOR_FRONTEND_DEVS.md](docs/BACKEND_FOR_FRONTEND_DEVS.md) if you know frontend and are learning backend.
3. Read [docs/FRONTEND_GUIDE.md](docs/FRONTEND_GUIDE.md) for the browser side.
4. Read [docs/VERCEL_DEPLOY.md](docs/VERCEL_DEPLOY.md) for deployment.
5. Open `src/app.js` to see how the API is assembled.
6. Open `public/app.js` to see how the frontend calls the API.
7. Open `src/routes/taskRoutes.js` to see which URL talks to which controller.
8. Open `src/controllers/taskController.js` to see the CRUD logic.
9. Open `src/repositories/taskRepository.js` to see how data is saved.

The source files include comments explaining what each part does and how the files talk to each other.

## Setup

```bash
npm install
npm run dev
```

The server starts at:

```text
http://localhost:3000
```

Open that URL in your browser to use the visual frontend.

## Endpoints

### Health check

```http
GET /health
```

### List tasks

```http
GET /api/tasks
```

Optional query params:

```http
GET /api/tasks?completed=true
GET /api/tasks?search=study
```

### Get one task

```http
GET /api/tasks/:id
```

### Create task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Study REST APIs",
  "description": "Practice CRUD endpoints"
}
```

### Update task

```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Study Express",
  "description": "Routes, controllers, and middleware",
  "completed": true
}
```

### Delete task

```http
DELETE /api/tasks/:id
```

## Example with curl

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn CRUD","description":"Create, read, update, delete"}'
```

## Project structure

```text
public/
  index.html             Visual page structure
  styles.css             Visual styling
  app.js                 Browser JavaScript that calls the API
api/
  index.js               Vercel serverless function entry point
src/
  app.js                 Express app setup
  server.js              Starts the HTTP server
  controllers/           Request and response logic
  middleware/            Error and not-found handlers
  repositories/          Data access layer
  routes/                API route definitions
  validators/            Request validation helpers
data/
  tasks.json             Local JSON database for study
tests/
  tasks.test.js          API tests
```

## Dependency direction

Read this from top to bottom:

```text
public/app.js
  -> HTTP request to /api/tasks
src/app.js
  -> mounts task routes at /api/tasks
src/routes/taskRoutes.js
  -> calls task controller functions
src/controllers/taskController.js
  -> calls validators and repositories
src/repositories/taskRepository.js
  -> reads/writes data/tasks.json locally
  -> uses Postgres on Vercel when DATABASE_URL or POSTGRES_URL exists
```
