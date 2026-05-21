// This file is the browser-side JavaScript.
// It listens to clicks/forms, calls the backend with fetch(), and updates the page.

const apiUrl = "/api/tasks";

const elements = {
  form: document.querySelector("#task-form"),
  formTitle: document.querySelector("#form-title"),
  taskId: document.querySelector("#task-id"),
  title: document.querySelector("#title"),
  description: document.querySelector("#description"),
  completed: document.querySelector("#completed"),
  submitButton: document.querySelector(".primary-action"),
  cancelEdit: document.querySelector("#cancel-edit"),
  refresh: document.querySelector("#refresh"),
  filters: document.querySelectorAll(".filter-button"),
  taskList: document.querySelector("#task-list"),
  taskCount: document.querySelector("#task-count"),
  statusMessage: document.querySelector("#status-message"),
  lastCall: document.querySelector("#last-call"),
  lastMethod: document.querySelector("#last-method"),
  flowSteps: document.querySelectorAll(".flow-step"),
  currentAction: document.querySelector("#current-action"),
  codePath: document.querySelector("#code-path"),
  stateViewer: document.querySelector("#state-viewer"),
  endpointCards: document.querySelectorAll(".endpoint-card"),
  endpointLesson: document.querySelector("#endpoint-lesson")
};

let tasks = [];
let activeFilter = "all";

const lessons = {
  list: {
    action: "Read tasks from the backend.",
    method: "GET",
    path: "/api/tasks",
    codePath: `public/app.js: loadTasks()
  -> apiRequest("GET", "/api/tasks")
  -> src/routes/taskRoutes.js: router.get("/", listTasks)
  -> src/controllers/taskController.js: listTasks()
  -> src/repositories/taskRepository.js: findAll()
  -> data/tasks.json`,
    lesson: `GET /api/tasks

Frontend:
  public/app.js -> loadTasks()

Backend:
  src/routes/taskRoutes.js -> router.get("/", listTasks)
  src/controllers/taskController.js -> listTasks()
  src/repositories/taskRepository.js -> findAll()

Meaning:
  Read saved tasks and return JSON to the browser.`
  },
  create: {
    action: "Create a new task from form data.",
    method: "POST",
    path: "/api/tasks",
    codePath: `public/app.js: saveTask()
  -> apiRequest("POST", "/api/tasks", payload)
  -> src/routes/taskRoutes.js: router.post("/", createTask)
  -> src/controllers/taskController.js: createTask()
  -> src/validators/taskValidator.js: validateCreateTask()
  -> src/repositories/taskRepository.js: create()
  -> data/tasks.json`,
    lesson: `POST /api/tasks

Frontend:
  public/app.js -> saveTask()
  Reads title and description from the form.

Backend:
  createTask() validates req.body.
  create() adds id, completed, createdAt, updatedAt.

Meaning:
  Send new data from the browser to the API and save it.`
  },
  update: {
    action: "Update an existing task by ID.",
    method: "PUT",
    path: "/api/tasks/:id",
    codePath: `public/app.js: saveTask() or toggleTask()
  -> apiRequest("PUT", "/api/tasks/:id", payload)
  -> src/routes/taskRoutes.js: router.put("/:id", updateTask)
  -> src/controllers/taskController.js: updateTask()
  -> src/validators/taskValidator.js: validateUpdateTask()
  -> src/repositories/taskRepository.js: update()
  -> data/tasks.json`,
    lesson: `PUT /api/tasks/:id

Frontend:
  public/app.js -> saveTask() when editing
  public/app.js -> toggleTask() when clicking Done/Reopen

Backend:
  updateTask() reads req.params.id and req.body.
  update() finds the task index and replaces the saved object.

Meaning:
  Change a saved task using its unique ID.`
  },
  delete: {
    action: "Delete a task by ID.",
    method: "DELETE",
    path: "/api/tasks/:id",
    codePath: `public/app.js: deleteTask()
  -> apiRequest("DELETE", "/api/tasks/:id")
  -> src/routes/taskRoutes.js: router.delete("/:id", deleteTask)
  -> src/controllers/taskController.js: deleteTask()
  -> src/repositories/taskRepository.js: remove()
  -> data/tasks.json`,
    lesson: `DELETE /api/tasks/:id

Frontend:
  public/app.js -> deleteTask()

Backend:
  deleteTask() asks the repository to remove the task.
  remove() uses splice() to delete one item from the array.

Meaning:
  Remove one saved task and return HTTP 204 with no response body.`
  }
};

// apiRequest is the single place where the frontend talks to the backend.
// Every CREATE, READ, UPDATE, and DELETE action passes through here.
async function apiRequest(method, url, body) {
  const options = {
    method,
    headers: {}
  };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  showLastCall(method, url, body);

  const response = await fetch(url, options);

  if (response.status === 204) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

function showLastCall(method, url, body) {
  elements.lastMethod.textContent = method;
  elements.lastCall.textContent = JSON.stringify(
    {
      frontendAction: "fetch() from public/app.js",
      backendEndpoint: `${method} ${url}`,
      requestBody: body || null,
      backendFlow: "route -> controller -> validator/repository -> data/tasks.json"
    },
    null,
    2
  );
}

function setLesson(key) {
  const lesson = lessons[key];

  elements.currentAction.textContent = lesson.action;
  elements.codePath.textContent = lesson.codePath;
  elements.endpointLesson.textContent = lesson.lesson;

  elements.endpointCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.endpoint === key);
  });
}

function showFlow(method) {
  const activeStepsByMethod = {
    GET: ["frontend", "route", "controller", "repository"],
    POST: ["frontend", "route", "controller", "repository"],
    PUT: ["frontend", "route", "controller", "repository"],
    DELETE: ["frontend", "route", "controller", "repository"]
  };

  const activeSteps = activeStepsByMethod[method] || ["frontend"];

  elements.flowSteps.forEach((step) => {
    step.classList.toggle("active", activeSteps.includes(step.dataset.flowStep));
  });
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
}

function updateStateViewer() {
  elements.stateViewer.textContent = JSON.stringify(
    {
      activeFilter,
      tasksInMemory: tasks.length,
      editingTaskId: elements.taskId.value || null,
      visibleTasks: getVisibleTasks().length
    },
    null,
    2
  );
}

function resetForm() {
  elements.form.reset();
  elements.taskId.value = "";
  elements.formTitle.textContent = "Create task";
  elements.submitButton.textContent = "Create task";
  elements.cancelEdit.classList.add("hidden");
  updateStateViewer();
}

function startEdit(task) {
  setLesson("update");
  elements.taskId.value = task.id;
  elements.title.value = task.title;
  elements.description.value = task.description;
  elements.completed.checked = task.completed;
  elements.formTitle.textContent = "Edit task";
  elements.submitButton.textContent = "Save changes";
  elements.cancelEdit.classList.remove("hidden");
  elements.title.focus();
  updateStateViewer();
}

function getVisibleTasks() {
  if (activeFilter === "all") {
    return tasks;
  }

  const completed = activeFilter === "true";
  return tasks.filter((task) => task.completed === completed);
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  elements.taskList.innerHTML = "";
  elements.taskCount.textContent = `${visibleTasks.length} task${visibleTasks.length === 1 ? "" : "s"}`;
  updateStateViewer();

  if (visibleTasks.length === 0) {
    elements.taskList.innerHTML = '<li class="task-item"><p class="task-description">No tasks to show yet.</p></li>';
    return;
  }

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    item.innerHTML = `
      <div>
        <p class="task-title"></p>
        <p class="task-description"></p>
        <p class="task-meta"></p>
      </div>
      <div class="task-actions">
        <button class="small-action" type="button" data-action="toggle"></button>
        <button class="small-action" type="button" data-action="edit">Edit</button>
        <button class="small-action danger" type="button" data-action="delete">Delete</button>
      </div>
    `;

    item.querySelector(".task-title").textContent = task.title;
    item.querySelector(".task-description").textContent = task.description || "No description";
    item.querySelector(".task-meta").textContent = `ID: ${task.id}`;
    item.querySelector('[data-action="toggle"]').textContent = task.completed ? "Reopen" : "Done";

    item.querySelector('[data-action="toggle"]').addEventListener("click", () => toggleTask(task));
    item.querySelector('[data-action="edit"]').addEventListener("click", () => startEdit(task));
    item.querySelector('[data-action="delete"]').addEventListener("click", () => deleteTask(task.id));

    elements.taskList.appendChild(item);
  });
}

async function loadTasks() {
  try {
    setLesson("list");
    showFlow("GET");
    const query = activeFilter === "all" ? "" : `?completed=${activeFilter}`;
    const result = await apiRequest("GET", `${apiUrl}${query}`);
    tasks = result.data;
    renderTasks();
    setStatus("Tasks loaded from the API.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function saveTask(event) {
  event.preventDefault();

  const id = elements.taskId.value;
  const isEditing = Boolean(id);
  setLesson(isEditing ? "update" : "create");
  showFlow(isEditing ? "PUT" : "POST");
  const payload = {
    title: elements.title.value,
    description: elements.description.value
  };

  if (isEditing) {
    payload.completed = elements.completed.checked;
  }

  try {
    await apiRequest(isEditing ? "PUT" : "POST", isEditing ? `${apiUrl}/${id}` : apiUrl, payload);
    resetForm();
    await loadTasks();
    setStatus(isEditing ? "Task updated." : "Task created.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function toggleTask(task) {
  try {
    setLesson("update");
    showFlow("PUT");
    await apiRequest("PUT", `${apiUrl}/${task.id}`, {
      title: task.title,
      description: task.description,
      completed: !task.completed
    });
    await loadTasks();
    setStatus(task.completed ? "Task reopened." : "Task completed.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteTask(id) {
  try {
    setLesson("delete");
    showFlow("DELETE");
    await apiRequest("DELETE", `${apiUrl}/${id}`);
    await loadTasks();
    setStatus("Task deleted.");
  } catch (error) {
    setStatus(error.message);
  }
}

elements.form.addEventListener("submit", saveTask);
elements.cancelEdit.addEventListener("click", resetForm);
elements.refresh.addEventListener("click", loadTasks);

elements.filters.forEach((button) => {
  button.addEventListener("click", () => {
    elements.filters.forEach((filterButton) => filterButton.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    updateStateViewer();
    loadTasks();
  });
});

elements.endpointCards.forEach((card) => {
  card.addEventListener("click", () => {
    const lessonKey = card.dataset.endpoint;
    setLesson(lessonKey);
    showFlow(lessons[lessonKey].method);
  });
});

setLesson("list");
updateStateViewer();
loadTasks();
