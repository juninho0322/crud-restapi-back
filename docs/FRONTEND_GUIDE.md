# React Frontend Study Guide

The frontend is now React + TypeScript.

## Frontend Files

```text
src/client/
  index.html
  src/main.tsx
  src/App.tsx
  src/components/StudyGuide.tsx
  src/components/ArchitectureDiagram.tsx
  src/types.ts
  src/styles-app.css
  src/styles-diagram.css
```

## How React Talks To The Backend

React uses `fetch()` in `src/client/src/App.tsx`.

```ts
fetch("/api/tasks")
```

The frontend does not import backend files directly. It talks to the backend through HTTP.

```text
src/client/src/App.tsx
  -> fetch("/api/tasks")
  -> src/app.ts
  -> src/routes/taskRoutes.ts
  -> src/controllers/taskController.ts
  -> src/repositories/taskRepository.ts
  -> data/tasks.json locally or Supabase on Vercel
```

## Main Frontend Flow

```text
User clicks or submits a form
  -> React event handler runs
  -> App.tsx builds a request
  -> fetch() calls /api/tasks
  -> Express backend handles the request
  -> backend returns JSON
  -> React state updates
  -> JSX re-renders the task list
```

## Important Functions In `App.tsx`

`apiRequest()` is the bridge between React and the API.

`loadTasks()` reads tasks from the backend.

`saveTask()` creates or updates a task.

`toggleTask()` changes completed/open status.

`deleteTask()` removes one task.

`startEdit()` copies a task into React form state.
