import { useEffect, useMemo, useState } from "react";

import type { ApiHistoryItem, ApiMethod, FilterValue, LessonKey, Task } from "./types.js";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram.js";
import { CodeBreakdown } from "./components/CodeBreakdown.js";
import { StudyGuide } from "./components/StudyGuide.js";
import { StudyPath } from "./components/StudyPath.js";

const apiUrl = "/api/tasks";

const lessons: Record<LessonKey, { action: string; method: ApiMethod; codePath: string; lesson: string }> = {
  list: {
    action: "Read tasks from the backend.",
    method: "GET",
    codePath: `src/client/src/App.tsx: loadTasks()
  -> apiRequest("GET", "/api/tasks")
  -> src/routes/taskRoutes.ts: router.get("/", listTasks)
  -> src/controllers/taskController.ts: listTasks()
  -> src/repositories/taskRepository.ts: findAll()
  -> local JSON or Supabase Postgres`,
    lesson: `GET /api/tasks

Frontend:
  App.tsx -> loadTasks()

Backend:
  taskRoutes.ts -> router.get("/", listTasks)
  taskController.ts -> listTasks()
  taskRepository.ts -> findAll()

Meaning:
  Read saved tasks and return JSON to React.`
  },
  create: {
    action: "Create a new task from form data.",
    method: "POST",
    codePath: `src/client/src/App.tsx: saveTask()
  -> apiRequest("POST", "/api/tasks", payload)
  -> src/routes/taskRoutes.ts: router.post("/", createTask)
  -> src/controllers/taskController.ts: createTask()
  -> src/validators/taskValidator.ts: validateCreateTask()
  -> src/repositories/taskRepository.ts: create()`,
    lesson: `POST /api/tasks

Frontend:
  App.tsx -> saveTask()

Backend:
  createTask() validates req.body.
  create() adds id, completed, createdAt, updatedAt.

Meaning:
  Send new data from React to the API and save it.`
  },
  update: {
    action: "Update an existing task by ID.",
    method: "PUT",
    codePath: `src/client/src/App.tsx: saveTask() or toggleTask()
  -> apiRequest("PUT", "/api/tasks/:id", payload)
  -> src/routes/taskRoutes.ts: router.put("/:id", updateTask)
  -> src/controllers/taskController.ts: updateTask()
  -> src/validators/taskValidator.ts: validateUpdateTask()
  -> src/repositories/taskRepository.ts: update()`,
    lesson: `PUT /api/tasks/:id

Frontend:
  App.tsx -> saveTask() when editing
  App.tsx -> toggleTask() when clicking Done/Reopen

Backend:
  updateTask() reads req.params.id and req.body.

Meaning:
  Change a saved task using its unique ID.`
  },
  delete: {
    action: "Delete a task by ID.",
    method: "DELETE",
    codePath: `src/client/src/App.tsx: deleteTask()
  -> apiRequest("DELETE", "/api/tasks/:id")
  -> src/routes/taskRoutes.ts: router.delete("/:id", deleteTask)
  -> src/controllers/taskController.ts: deleteTask()
  -> src/repositories/taskRepository.ts: remove()`,
    lesson: `DELETE /api/tasks/:id

Frontend:
  App.tsx -> deleteTask()

Backend:
  deleteTask() asks the repository to remove the task.

Meaning:
  Remove one saved task and return HTTP 204.`
  }
};

type TaskResponse = {
  data: Task;
};

type TaskListResponse = {
  count: number;
  data: Task[];
};

function isDiagramPage() {
  return window.location.pathname === "/diagram.html";
}

function isBreakdownPage() {
  return window.location.pathname === "/breakdown";
}

function isStudyPage() {
  return window.location.pathname === "/study";
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [statusMessage, setStatusMessage] = useState("");
  const [apiHistory, setApiHistory] = useState<ApiHistoryItem[]>([]);
  const [lastCall, setLastCall] = useState("The frontend will show each request here after you use the app.");
  const [lastMethod, setLastMethod] = useState<ApiMethod>("GET");
  const [lessonKey, setLessonKey] = useState<LessonKey>("list");
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    description: "",
    completed: false
  });

  const visibleTasks = useMemo(() => {
    if (activeFilter === "all") {
      return tasks;
    }

    return tasks.filter((task) => task.completed === (activeFilter === "true"));
  }, [activeFilter, tasks]);

  const currentLesson = lessons[lessonKey];

  async function apiRequest<T>(method: ApiMethod, url: string, body?: unknown, label = "User action") {
    const options: RequestInit = {
      method,
      headers: {}
    };

    if (body) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    showLastCall(method, url, body ?? null, label);

    const response = await fetch(url, options);

    if (response.status === 204) {
      return null as T;
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Request failed");
    }

    return result as T;
  }

  function showLastCall(method: ApiMethod, url: string, body: unknown, label: string) {
    const call: ApiHistoryItem = {
      id: Date.now(),
      label,
      method,
      url,
      body,
      time: new Date().toLocaleTimeString()
    };

    setApiHistory((history) => [call, ...history].slice(0, 8));
    setLastMethod(method);
    setLastCall(
      JSON.stringify(
        {
          label,
          frontendAction: "fetch() from src/client/src/App.tsx",
          backendEndpoint: `${method} ${url}`,
          requestBody: body,
          backendFlow: "route -> controller -> validator/repository -> storage"
        },
        null,
        2
      )
    );
  }

  async function loadTasks(filter = activeFilter) {
    try {
      setLessonKey("list");
      const query = filter === "all" ? "" : `?completed=${filter}`;
      const result = await apiRequest<TaskListResponse>("GET", `${apiUrl}${query}`, null, "Automatic refresh");
      setTasks(result.data);
      setStatusMessage("Tasks loaded from the API.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to load tasks");
    }
  }

  async function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isEditing = Boolean(formState.id);
    const payload = {
      title: formState.title,
      description: formState.description,
      ...(isEditing ? { completed: formState.completed } : {})
    };

    try {
      setLessonKey(isEditing ? "update" : "create");
      await apiRequest<TaskResponse>(
        isEditing ? "PUT" : "POST",
        isEditing ? `${apiUrl}/${formState.id}` : apiUrl,
        payload,
        isEditing ? "Save edit" : "Create task"
      );
      resetForm();
      await loadTasks();
      setStatusMessage(isEditing ? "Task updated." : "Task created.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to save task");
    }
  }

  async function toggleTask(task: Task) {
    try {
      setLessonKey("update");
      await apiRequest<TaskResponse>(
        "PUT",
        `${apiUrl}/${task.id}`,
        {
          title: task.title,
          description: task.description,
          completed: !task.completed
        },
        task.completed ? "Reopen task" : "Complete task"
      );
      await loadTasks();
      setStatusMessage(task.completed ? "Task reopened." : "Task completed.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to update task");
    }
  }

  async function deleteTask(id: string) {
    try {
      setLessonKey("delete");
      await apiRequest<null>("DELETE", `${apiUrl}/${id}`, null, "Delete task");
      await loadTasks();
      setStatusMessage("Task deleted.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to delete task");
    }
  }

  function startEdit(task: Task) {
    setLessonKey("update");
    setFormState({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed
    });
  }

  function resetForm() {
    setFormState({
      id: "",
      title: "",
      description: "",
      completed: false
    });
  }

  useEffect(() => {
    void loadTasks("all");
  }, []);

  if (isDiagramPage()) {
    return <ArchitectureDiagram />;
  }

  if (isBreakdownPage()) {
    return <CodeBreakdown />;
  }

  if (isStudyPage()) {
    return <StudyPath />;
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">CRUD Study</p>
            <h1>Tasks REST API Dashboard</h1>
          </div>
          <nav className="top-actions" aria-label="Study links">
            <a className="docs-link" href="/api/tasks" target="_blank" rel="noreferrer">
              View raw JSON
            </a>
            <a className="docs-link" href="/diagram.html">
              Architecture diagram
            </a>
            <a className="docs-link" href="/breakdown">
              Code breakdown
            </a>
            <a className="docs-link" href="/study">
              Complete study path
            </a>
            <a className="docs-link" href="#study-guide">
              Study guide
            </a>
            <a className="docs-link" href="#study-plan">
              Study plan
            </a>
          </nav>
        </header>

        <section className="flow-panel" aria-label="Request flow">
          {["Frontend", "Route", "Controller", "Repository"].map((step, index) => (
            <div className="flow-step active" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              <small>{index === 0 ? "React event" : index === 1 ? "/api/tasks" : index === 2 ? "request logic" : "storage"}</small>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <form id="task-form" className="editor" autoComplete="off" onSubmit={saveTask}>
            <div className="section-title">
              <h2>{formState.id ? "Edit task" : "Create task"}</h2>
              {formState.id ? (
                <button className="icon-button" type="button" aria-label="Cancel edit" onClick={resetForm}>
                  x
                </button>
              ) : null}
            </div>

            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              placeholder="Study Express routes"
              required
              value={formState.title}
              onChange={(event) => setFormState({ ...formState, title: event.target.value })}
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Write what this task is about"
              value={formState.description}
              onChange={(event) => setFormState({ ...formState, description: event.target.value })}
            />

            <label className="checkbox-row">
              <input
                id="completed"
                name="completed"
                type="checkbox"
                checked={formState.completed}
                onChange={(event) => setFormState({ ...formState, completed: event.target.checked })}
              />
              <span>Completed</span>
            </label>

            <button className="primary-action" type="submit">
              {formState.id ? "Save changes" : "Create task"}
            </button>
          </form>

          <section className="tasks-panel">
            <div className="section-title">
              <div>
                <h2>Tasks</h2>
                <p>
                  {visibleTasks.length} task{visibleTasks.length === 1 ? "" : "s"}
                </p>
              </div>
              <button className="icon-button" type="button" aria-label="Refresh tasks" onClick={() => loadTasks()}>
                ↻
              </button>
            </div>

            <div className="filters" aria-label="Task filters">
              {[
                ["all", "All"],
                ["false", "Open"],
                ["true", "Done"]
              ].map(([value, label]) => (
                <button
                  className={`filter-button${activeFilter === value ? " active" : ""}`}
                  key={value}
                  type="button"
                  onClick={() => {
                    const filter = value as FilterValue;
                    setActiveFilter(filter);
                    void loadTasks(filter);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="status-message" role="status">
              {statusMessage}
            </div>
            <ul className="task-list">
              {visibleTasks.length === 0 ? (
                <li className="task-item">
                  <p className="task-description">No tasks to show yet.</p>
                </li>
              ) : (
                visibleTasks.map((task) => (
                  <li className={`task-item${task.completed ? " completed" : ""}`} key={task.id}>
                    <div>
                      <p className="task-title">{task.title}</p>
                      <p className="task-description">{task.description || "No description"}</p>
                      <p className="task-meta">ID: {task.id}</p>
                    </div>
                    <div className="task-actions">
                      <button className="small-action" type="button" onClick={() => toggleTask(task)}>
                        {task.completed ? "Reopen" : "Done"}
                      </button>
                      <button className="small-action" type="button" onClick={() => startEdit(task)}>
                        Edit
                      </button>
                      <button className="small-action danger" type="button" onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </section>

        <section className="request-log">
          <div className="section-title">
            <h2>Last API call</h2>
            <span id="last-method">{lastMethod}</span>
          </div>
          <pre>{lastCall}</pre>
          <div className="section-title api-history-title">
            <div>
              <h2>API call history</h2>
              <p>Create/update/delete stays visible here even after the app refreshes the list.</p>
            </div>
            <button className="small-action" type="button" onClick={() => setApiHistory([])}>
              Clear
            </button>
          </div>
          <ol className="api-history">
            {apiHistory.map((call) => (
              <li className="api-history-item" key={call.id}>
                <div>
                  <strong>
                    {call.method} {call.url}
                  </strong>
                  <span>{call.label}</span>
                </div>
                <small>{call.time}</small>
              </li>
            ))}
          </ol>
        </section>

        <StudyGuide
          currentLesson={currentLesson}
          lessonKey={lessonKey}
          setLessonKey={setLessonKey}
          state={{
            activeFilter,
            tasksInMemory: tasks.length,
            editingTaskId: formState.id || null,
            visibleTasks: visibleTasks.length
          }}
        />
      </section>
    </main>
  );
}
