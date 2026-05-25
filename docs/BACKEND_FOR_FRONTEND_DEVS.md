# Backend For Frontend Developers

You already know the frontend. So think of this backend as the part your frontend calls when it needs data to survive a page refresh.

## Frontend vs Backend

Frontend code runs in the browser.

Backend code runs on the server.

In this project, both are served by Express, but they still have different jobs.

```text
Browser
  src/client/index.html
  src/client/src/styles-app.css
  src/client/src/App.tsx

Server
  src/server.ts
  src/app.ts
  src/routes/
  src/controllers/
  src/validators/
  src/repositories/
  data/tasks.json
```

## The Most Important Rule

Dependencies should point inward and downward.

```text
src/client/src/App.tsx
  calls HTTP endpoint

src/routes/taskRoutes.ts
  calls controller functions

src/controllers/taskController.ts
  calls validators and repositories

src/validators/taskValidator.ts
  checks request body

src/repositories/taskRepository.ts
  reads and writes data/tasks.json locally
  uses Postgres on Vercel when DATABASE_URL or POSTGRES_URL exists
  uses temporary memory on Vercel if no database URL exists
```

The repository does not call the controller.

The controller does not call the route.

The backend does not directly reach into browser DOM elements.

Each layer has one job.

## Folder Structure

```text
Crud-study/
  src/client/
    index.html
    src/main.tsx
    src/App.tsx
    src/components/
    src/styles.css
    src/styles-app.css
    src/styles-diagram.css
    src/types.ts

  src/
    server.ts
    app.ts

    routes/
      taskRoutes.ts

    controllers/
      taskController.ts

    validators/
      taskValidator.ts

    repositories/
      taskRepository.ts

    middleware/
      notFoundHandler.ts
      errorHandler.ts

  data/
    tasks.json

  tests/
    tasks.test.ts
```

## What Talks To What

```text
src/client/index.html
  is controlled by src/client/src/App.tsx

src/client/src/App.tsx
  calls /api/tasks using fetch()

src/app.ts
  receives /api/tasks and forwards it to taskRoutes

src/routes/taskRoutes.ts
  matches method + URL and calls the correct controller

src/controllers/taskController.ts
  reads req, validates input, calls repository, sends res

src/validators/taskValidator.ts
  checks if req.body is valid

src/repositories/taskRepository.ts
  loads and saves tasks in data/tasks.json locally or Postgres on Vercel

data/tasks.json
  stores the actual task data
```

## Request Example: Create Task

You submit the form in the browser.

```text
1. src/client/src/App.tsx
   saveTask() creates this payload:
   { title, description }

2. src/client/src/App.tsx
   apiRequest("POST", "/api/tasks", payload)

3. src/app.ts
   sees /api/tasks and sends request to taskRoutes

4. src/routes/taskRoutes.ts
   router.post("/", createTask)

5. src/controllers/taskController.ts
   createTask(req, res, next)

6. src/validators/taskValidator.ts
   validateCreateTask(req.body)

7. src/repositories/taskRepository.ts
   create(req.body)

8. data/tasks.json
   saves the new task

9. Browser
   receives JSON and redraws the task list
```

## Backend Concepts Using Frontend Language

### Route

A route is like a click handler for URLs.

React frontend:

```tsx
<form onSubmit={saveTask}>
  ...
</form>
```

Backend:

```js
router.post("/", createTask);
```

Meaning: when a POST request arrives at this URL, run `createTask`.

### Controller

A controller is like the main function that handles an interaction.

It receives the request, decides what needs to happen, and sends a response.

### `req`

`req` means request.

It contains what the client sent.

Common places to read:

```js
req.body
req.params
req.query
```

### `res`

`res` means response.

It is how the backend sends data back.

```js
res.status(201).json({ data: task });
```

### Repository

A repository is the data layer.

Today it uses a JSON file. Later it could use a real database without changing the route names.

### Middleware

Middleware runs before or after routes.

In this project:

```js
express.json()
```

turns JSON request bodies into `req.body`.

## What Each CRUD Action Depends On

```text
Create
  frontend form
  -> POST route
  -> create controller
  -> create validator
  -> create repository
  -> JSON file

Read
  frontend page load or refresh
  -> GET route
  -> list controller
  -> findAll repository
  -> JSON file

Update
  frontend edit form or Done button
  -> PUT route
  -> update controller
  -> update validator
  -> update repository
  -> JSON file

Delete
  frontend Delete button
  -> DELETE route
  -> delete controller
  -> remove repository
  -> JSON file
```

## How To Read This Project

1. Open the app at `http://localhost:3000`.
2. Create one task.
3. Look at the "Last API call" panel.
4. Open `src/client/src/App.tsx` and find the function named in the panel.
5. Open `src/routes/taskRoutes.ts` and find the matching HTTP method.
6. Open `src/controllers/taskController.ts` and read the matching controller.
7. Open `src/repositories/taskRepository.ts` and find the matching data function.
8. Open `data/tasks.json` and see the saved result.

This is the full loop: browser event to saved data.
