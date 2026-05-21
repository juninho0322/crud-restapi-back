# Frontend Study Guide

This guide is for learning the visual part of the project. The frontend lives in `public/` and is served by the Express backend.

Because you already know frontend, use the frontend as your map into the backend. Every important backend action starts from a frontend `fetch()` call.

## Frontend Files

```text
public/
  index.html   Page structure
  styles.css   Visual design
  app.js       Browser behavior and API calls
```

## How The Frontend Talks To The Backend

The frontend uses `fetch()` in `public/app.js`.

```js
fetch("/api/tasks")
```

Because the frontend and backend are served from the same Express server, the browser can call `/api/tasks` directly.

## Frontend To Backend Dependency Map

```text
public/app.js
  apiRequest()
    -> fetch("/api/tasks")
      -> src/app.js
        -> src/routes/taskRoutes.js
          -> src/controllers/taskController.js
            -> src/repositories/taskRepository.js
              -> data/tasks.json
```

The frontend does not import backend files directly. It talks to the backend through HTTP.

## Main Frontend Flow

```text
User clicks or submits a form
  -> event listener runs
  -> public/app.js builds a request
  -> fetch() calls /api/tasks
  -> Express backend handles the request
  -> backend returns JSON
  -> public/app.js updates browser state
  -> renderTasks() redraws the task list
```

## Important Functions In `public/app.js`

### `apiRequest(method, url, body)`

The main API helper.

All frontend API calls go through this function. It builds the fetch options, sends JSON when needed, checks for errors, and returns the backend response.

### `loadTasks()`

Reads tasks from the backend.

Called when the page first opens, when you refresh, and after create/update/delete.

### `saveTask(event)`

Handles the form submit.

If there is no task ID, it creates a task with `POST /api/tasks`.

If there is a task ID, it updates a task with `PUT /api/tasks/:id`.

### `renderTasks()`

Takes the JavaScript `tasks` array and turns it into visible HTML.

This is why the screen changes after the API responds.

### `startEdit(task)`

Copies a task into the form so you can edit it.

### `toggleTask(task)`

Uses `PUT /api/tasks/:id` to switch a task between open and completed.

### `deleteTask(id)`

Uses `DELETE /api/tasks/:id` to remove a task.

## Important Frontend Concepts

### DOM

The DOM is the browser's live version of the HTML page.

JavaScript uses lines like this to find DOM elements:

```js
document.querySelector("#task-form")
```

### Event Listener

An event listener waits for something to happen.

Example:

```js
elements.form.addEventListener("submit", saveTask);
```

This means: when the form submits, run `saveTask`.

### State

State is data the frontend keeps in memory.

In this project:

```js
let tasks = [];
let activeFilter = "all";
```

### Render

Render means turn data into UI.

In this project, `renderTasks()` reads the `tasks` array and creates `<li>` elements on the page.

## Practice Path

1. Open `http://localhost:3000`.
2. Create a task in the form.
3. Watch the "Last API call" and "Current code path" panels.
4. Open `public/app.js`.
5. Find `saveTask()`.
6. Follow it into `apiRequest()`.
7. Open `src/routes/taskRoutes.js`.
8. Find the matching backend route.
9. Follow the route into the controller and repository.

## Frontend Practice Challenges

1. Add a search input to filter tasks by title.
2. Add a priority dropdown with `low`, `medium`, and `high`.
3. Show the created date in a nicer format.
4. Add a button that clears the form.
5. Add a small loading message while requests are running.
