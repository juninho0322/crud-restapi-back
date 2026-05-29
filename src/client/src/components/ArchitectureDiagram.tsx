import { useState } from "react";

import type { DiagramNodeKey } from "../types.js";

const nodeLessons: Record<
  DiagramNodeKey,
  {
    title: string;
    file: string;
    path: string;
    role: string;
    explanation: string;
    code: string;
    functions: Array<{ name: string; does: string; reads: string; gives: string }>;
    vocabulary: Array<{ word: string; means: string }>;
    studySteps: string[];
  }
> = {
  frontend: {
    title: "React Frontend",
    file: "src/client/src/App.tsx",
    path: "src/client/src/App.tsx",
    role: "asks",
    explanation: "This is browser code. It reacts to clicks/forms, builds a request, and calls the API with fetch().",
    code: `async function apiRequest(method, url, body) {
  const response = await fetch(url, options);
  return response.json();
}`,
    functions: [
      {
        name: "apiRequest(method, url, body, label)",
        does: "Reusable helper for all API calls.",
        reads: "The HTTP method, API URL, optional request body, and a label for the history panel.",
        gives: "Parsed JSON from the backend, or null when the backend returns 204."
      },
      {
        name: "saveTask(event)",
        does: "Runs when the form submits. It creates a new task or updates an existing one.",
        reads: "formState from React state and event.preventDefault() from the form event.",
        gives: "A POST or PUT request to /api/tasks."
      },
      {
        name: "loadTasks(filter)",
        does: "Refreshes the visible task list from the backend.",
        reads: "The current filter: all, open, or done.",
        gives: "New tasks into setTasks(), which re-renders the UI."
      }
    ],
    vocabulary: [
      { word: "async", means: "This function can wait for slow work such as fetch()." },
      { word: "method", means: "The HTTP action: GET, POST, PUT, or DELETE." },
      { word: "body", means: "The data sent from React to the API, usually JSON." },
      { word: "fetch", means: "The browser function that sends an HTTP request." },
      { word: "setTasks", means: "A React state setter. It changes state and causes the UI to render again." }
    ],
    studySteps: [
      "Start in the browser and click Create task.",
      "Find saveTask() in App.tsx and read the payload object.",
      "Follow apiRequest() and notice where fetch() receives method, url, and body.",
      "After the request finishes, find where loadTasks() refreshes the UI."
    ]
  },
  express: {
    title: "Express App",
    file: "src/app.ts",
    path: "src/app.ts",
    role: "receives",
    explanation: "This creates the Express app, serves the React build, reads JSON bodies, and mounts task routes.",
    code: `app.use(express.json());
app.use(express.static(clientBuildDirectory));
app.use("/api/tasks", taskRoutes);`,
    functions: [
      {
        name: "app.use(express.json())",
        does: "Adds middleware that parses incoming JSON.",
        reads: "Raw request body from the browser.",
        gives: "A JavaScript object on req.body."
      },
      {
        name: "app.use('/api/tasks', taskRoutes)",
        does: "Mounts the task router at the /api/tasks URL prefix.",
        reads: "Any request that starts with /api/tasks.",
        gives: "The request to taskRoutes.ts."
      },
      {
        name: "app.get('/health', ...)",
        does: "Creates a small endpoint for checking if the API is alive.",
        reads: "A browser/API GET request to /health.",
        gives: "JSON with status and storage mode."
      }
    ],
    vocabulary: [
      { word: "app", means: "The Express server object. It is where middleware and routes are connected." },
      { word: "use", means: "Express method for adding middleware or mounting routers." },
      { word: "middleware", means: "Code that runs during the request pipeline before the final response." },
      { word: "static", means: "Serves built frontend files like HTML, CSS, and JS." },
      { word: "next", means: "Function used to pass control to the next middleware or error handler." }
    ],
    studySteps: [
      "Open src/app.ts first when studying the backend.",
      "Read top to bottom: middleware, health route, API route, React routes, 404, error handler.",
      "Find app.use('/api/tasks', taskRoutes). That line is the doorway into the CRUD API."
    ]
  },
  routes: {
    title: "Routes",
    file: "src/routes/taskRoutes.ts",
    path: "src/routes/taskRoutes.ts",
    role: "points",
    explanation: "Routes match HTTP method + URL and point the request to the correct controller function.",
    code: `router.get("/", listTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);`,
    functions: [
      {
        name: "router.get('/', listTasks)",
        does: "Registers the read-all endpoint.",
        reads: "GET /api/tasks requests.",
        gives: "The request to listTasks()."
      },
      {
        name: "router.post('/', createTask)",
        does: "Registers the create endpoint.",
        reads: "POST /api/tasks requests.",
        gives: "The request to createTask()."
      },
      {
        name: "router.put('/:id', updateTask)",
        does: "Registers the update endpoint with a dynamic id.",
        reads: "PUT /api/tasks/some-id requests.",
        gives: "The request to updateTask(), where req.params.id holds the id."
      },
      {
        name: "router.delete('/:id', deleteTask)",
        does: "Registers the delete endpoint with a dynamic id.",
        reads: "DELETE /api/tasks/some-id requests.",
        gives: "The request to deleteTask()."
      }
    ],
    vocabulary: [
      { word: "router", means: "A mini Express app used to group related routes." },
      { word: "get/post/put/delete", means: "JavaScript methods on router that register HTTP endpoints." },
      { word: "'/'", means: "The router root. Because app.ts mounts it at /api/tasks, this means /api/tasks." },
      { word: "':id'", means: "A dynamic URL parameter. Express stores it in req.params.id." },
      { word: "callback", means: "The controller function passed to the route and called later by Express." }
    ],
    studySteps: [
      "Read taskRoutes.ts like a menu.",
      "For each line, say: method, final URL, controller function.",
      "Memorize that routes do not save data. They only point to controllers."
    ]
  },
  controllers: {
    title: "Controllers",
    file: "src/controllers/taskController.ts",
    path: "src/controllers/taskController.ts",
    role: "decides",
    explanation: "Controllers read req, call validators/repositories, and send the response with res.",
    code: `export async function createTask(req, res, next) {
  const validationError = validateCreateTask(req.body);
  const task = await create(req.body);
  return res.status(201).json({ data: task });
}`,
    functions: [
      {
        name: "listTasks(req, res, next)",
        does: "Reads optional filters and returns a list of tasks.",
        reads: "req.query.completed and req.query.search.",
        gives: "JSON with count and data."
      },
      {
        name: "createTask(req, res, next)",
        does: "Validates input, asks the repository to create a task, and returns 201.",
        reads: "req.body from the frontend.",
        gives: "JSON with the created task."
      },
      {
        name: "updateTask(req, res, next)",
        does: "Validates input, updates one task by id, and handles 404 if it does not exist.",
        reads: "req.params.id and req.body.",
        gives: "JSON with the updated task."
      },
      {
        name: "deleteTask(req, res, next)",
        does: "Deletes one task by id.",
        reads: "req.params.id.",
        gives: "204 No Content when deletion works."
      }
    ],
    vocabulary: [
      { word: "req", means: "Request object. It contains body, params, query, headers, and other incoming data." },
      { word: "res", means: "Response object. It sends status codes and JSON back to the frontend." },
      { word: "next", means: "Passes an error to the central Express error handler." },
      { word: "status(201)", means: "Sets HTTP status to Created." },
      { word: "json({ data: task })", means: "Sends a JSON response body to React." }
    ],
    studySteps: [
      "Study createTask() first because it uses validation, repository, status code, and JSON.",
      "Circle every req, res, and next. Say what each one is doing.",
      "Then compare createTask(), updateTask(), and deleteTask(). Notice the repeated pattern."
    ]
  },
  validators: {
    title: "Validators",
    file: "src/validators/taskValidator.ts",
    path: "src/validators/taskValidator.ts",
    role: "protects",
    explanation: "Validators stop bad input before it reaches storage.",
    code: `export function validateCreateTask(payload) {
  if (isMissingText(payload.title)) {
    return "Title is required";
  }
  return null;
}`,
    functions: [
      {
        name: "isMissingText(value)",
        does: "Checks if a value is not usable text.",
        reads: "An unknown value.",
        gives: "true when the value is missing, not a string, or empty after trim()."
      },
      {
        name: "validateCreateTask(payload)",
        does: "Checks the data for creating a task.",
        reads: "Partial create payload from req.body.",
        gives: "An error message string, or null when valid."
      },
      {
        name: "validateUpdateTask(payload)",
        does: "Checks the data for updating a task.",
        reads: "Partial update payload from req.body.",
        gives: "An error message string, or null when valid."
      }
    ],
    vocabulary: [
      { word: "unknown", means: "TypeScript type for a value whose shape is not trusted yet." },
      { word: "typeof", means: "JavaScript operator that checks the kind of value." },
      { word: "trim()", means: "String method that removes spaces from the start and end." },
      { word: "null", means: "Here it means no validation error." },
      { word: "Partial", means: "TypeScript helper meaning some fields may be missing." }
    ],
    studySteps: [
      "Try creating a task with no title.",
      "Watch the API return 400.",
      "Open validateCreateTask() and find the exact line that caused that response."
    ]
  },
  repositories: {
    title: "Repository",
    file: "src/repositories/taskRepository.ts",
    path: "src/repositories/taskRepository.ts",
    role: "stores",
    explanation: "The repository is the data layer. Controllers ask it for data, and it decides whether to use local JSON or Supabase.",
    code: `export async function create(payload) {
  if (usePostgres) {
    // save in Supabase Postgres
  }

  // otherwise save locally for study
}`,
    functions: [
      {
        name: "findAll(filters)",
        does: "Reads many tasks, optionally filtered by completed/search.",
        reads: "TaskFilters from the controller.",
        gives: "An array of Task objects."
      },
      {
        name: "create(payload)",
        does: "Builds a full Task object and saves it.",
        reads: "CreateTaskPayload with title and optional description.",
        gives: "The saved Task with id, completed, createdAt, and updatedAt."
      },
      {
        name: "update(id, payload)",
        does: "Changes one existing task.",
        reads: "The task id and update payload.",
        gives: "The updated Task, or null if no task exists."
      },
      {
        name: "remove(id)",
        does: "Deletes one task.",
        reads: "The task id.",
        gives: "true if something was deleted, false if not found."
      }
    ],
    vocabulary: [
      { word: "repository", means: "A data-access layer. It hides how storage works from controllers." },
      { word: "pool.query", means: "Sends SQL to Postgres/Supabase." },
      { word: "readFile/writeFile", means: "Node functions for local JSON storage." },
      { word: "randomUUID", means: "Creates a unique id for each new task." },
      { word: "fallback", means: "If Postgres fails, this project can temporarily use memory storage." }
    ],
    studySteps: [
      "Start with create(payload). It is the easiest repository function to understand.",
      "Find where id and timestamps are added.",
      "Then compare the Postgres branch with the local JSON branch."
    ]
  },
  local: {
    title: "Local Storage",
    file: "data/tasks.json",
    path: "data/tasks.json",
    role: "local",
    explanation: "When you run locally without DATABASE_URL, tasks are saved in a JSON file so you can inspect the data directly.",
    code: `[
  {
    "id": "uuid",
    "title": "Study CRUD",
    "completed": false
  }
]`,
    functions: [
      {
        name: "readTasks()",
        does: "Reads tasks from data/tasks.json.",
        reads: "The local JSON file.",
        gives: "An array of Task objects."
      },
      {
        name: "writeTasks(tasks)",
        does: "Writes the whole task array back to data/tasks.json.",
        reads: "The updated task array.",
        gives: "A saved JSON file on your computer."
      }
    ],
    vocabulary: [
      { word: "JSON", means: "A text format that looks like JavaScript objects and arrays." },
      { word: "array", means: "A list of items. Here it is a list of tasks." },
      { word: "object", means: "A group of named values, like id/title/completed." },
      { word: "local", means: "Stored on your machine, not Supabase." }
    ],
    studySteps: [
      "Create a task locally.",
      "Open data/tasks.json.",
      "Compare the JSON fields with the Task type."
    ]
  },
  deployed: {
    title: "Supabase Postgres",
    file: "Supabase Table Editor",
    path: "Supabase Dashboard -> Table Editor -> public -> tasks",
    role: "deployed",
    explanation: "When DATABASE_URL is connected on Vercel, the same repository saves tasks in a real Postgres database.",
    code: `CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN NOT NULL
);`,
    functions: [
      {
        name: "ensureTasksTable()",
        does: "Creates the tasks table if it does not already exist.",
        reads: "The Postgres connection from DATABASE_URL or POSTGRES_URL.",
        gives: "A ready database table."
      },
      {
        name: "pool.query(sql, values)",
        does: "Runs SQL against Supabase Postgres.",
        reads: "SQL text and values such as title, description, completed.",
        gives: "Rows returned from the database."
      },
      {
        name: "rowToTask(row)",
        does: "Converts database column names into frontend/API field names.",
        reads: "Postgres row fields like created_at.",
        gives: "Task fields like createdAt."
      }
    ],
    vocabulary: [
      { word: "Postgres", means: "A relational database. Supabase hosts it for you." },
      { word: "table", means: "Database structure like a spreadsheet: rows and columns." },
      { word: "SQL", means: "Language used to create, read, update, and delete database rows." },
      { word: "PRIMARY KEY", means: "Column that uniquely identifies each row." },
      { word: "RETURNING *", means: "After insert/update, return the saved row." }
    ],
    studySteps: [
      "Open Supabase Table Editor.",
      "Create a task in the app.",
      "Refresh the table and match each database column to the Task type."
    ]
  }
};

const diagramStudyPath = [
  "Click React Frontend and study saveTask() plus apiRequest().",
  "Click Routes and say each endpoint out loud: method, URL, controller.",
  "Click Controllers and read createTask() word by word: req, validation, repository, res.",
  "Click Validators and see why bad input returns 400 before storage.",
  "Click Repository and compare create(), update(), remove(), and findAll().",
  "Click Local Storage or Supabase and connect the saved data back to the response JSON."
];

const nodes: Array<{ key: DiagramNodeKey; title: string; file: string; className: string }> = [
  { key: "frontend", title: "React Frontend", file: "App.tsx", className: "frontend" },
  { key: "express", title: "Express App", file: "src/app.ts", className: "express" },
  { key: "routes", title: "Routes", file: "taskRoutes.ts", className: "routes" },
  { key: "controllers", title: "Controllers", file: "taskController.ts", className: "controllers" },
  { key: "validators", title: "Validators", file: "taskValidator.ts", className: "validators" },
  { key: "repositories", title: "Repository", file: "taskRepository.ts", className: "repositories" },
  { key: "local", title: "Local Storage", file: "data/tasks.json", className: "local" },
  { key: "deployed", title: "Deployed Storage", file: "Supabase Postgres", className: "deployed" }
];

export function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<DiagramNodeKey | null>(null);
  const lesson = activeNode ? nodeLessons[activeNode] : null;

  return (
    <main className="diagram-shell">
      <header className="diagram-header">
        <div>
          <p className="eyebrow">CRUD Study</p>
          <h1>What Talks To What</h1>
          <p className="intro">Click the plus button on a node to see the TypeScript/React code for that part.</p>
        </div>
        <nav className="diagram-nav" aria-label="Diagram navigation">
          <a href="/">Back to app</a>
          <a href="/breakdown">Code breakdown</a>
          <a href="/study">Complete study path</a>
          <a href="/api/tasks" target="_blank" rel="noreferrer">Raw JSON</a>
        </nav>
      </header>

      <section className="diagram-board" aria-label="Project architecture diagram">
        <svg className="connector-lines" viewBox="0 0 1100 620" aria-hidden="true">
          <path d="M150 110 C250 110 250 110 350 110" />
          <path d="M470 110 C570 110 570 110 670 110" />
          <path d="M790 110 C890 110 890 110 990 110" />
          <path d="M990 170 C990 250 830 250 830 320" />
          <path d="M710 380 C610 380 610 380 510 380" />
          <path d="M390 380 C290 380 290 380 190 380" />
          <path d="M190 440 C190 520 350 520 350 560" />
          <path d="M510 560 C610 560 610 560 710 560" />
        </svg>

        {nodes.map((node) => (
          <article className={`diagram-node ${node.className}`} key={node.key}>
            <span></span>
            <strong>{node.title}</strong>
            <small>{node.file}</small>
            <button
              className="node-plus"
              type="button"
              aria-label={`Open ${node.title} code`}
              onClick={() => setActiveNode(node.key)}
            >
              +
            </button>
          </article>
        ))}
      </section>

      <section className="flow-summary">
        <h2>Read The Flow</h2>
        <p>Frontend asks. Express receives. Routes point. Controllers decide. Validators protect. Repository stores. Storage remembers.</p>
      </section>

      <section className="diagram-study-path">
        <div>
          <p className="eyebrow">Study path</p>
          <h2>How to study this diagram</h2>
        </div>
        <ol>
          {diagramStudyPath.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="api-contract">
        <div>
          <p className="eyebrow">API meaning</p>
          <h2>What exactly is the API?</h2>
          <p>The API is the agreed doorway between frontend and backend. React sends HTTP requests to API endpoints, and Express returns JSON.</p>
        </div>
        <pre>{`API endpoint example:

POST /api/tasks

Frontend sends:
{ "title": "Study API" }

Backend returns:
{ "data": { "id": "...", "title": "Study API" } }`}</pre>
      </section>

      {lesson ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveNode(null)}>
          <div
            className="code-popover visible"
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            aria-label="Code explanation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="popover-header">
              <div>
                <p id="popover-file">{lesson.file}</p>
                <h2>{lesson.title}</h2>
              </div>
              <div className="popover-actions">
                <span>{lesson.role}</span>
                <button className="modal-close" type="button" aria-label="Close code modal" onClick={() => setActiveNode(null)}>
                  x
                </button>
              </div>
            </div>
            <div className="path-row">
              <strong>Path</strong>
              <code>{lesson.path}</code>
            </div>
            <p className="popover-explanation">{lesson.explanation}</p>
            <pre><code>{lesson.code}</code></pre>
            <section className="modal-study-block">
              <h3>Functions in this piece</h3>
              <div className="function-list">
                {lesson.functions.map((item) => (
                  <article className="function-card" key={item.name}>
                    <code>{item.name}</code>
                    <p>{item.does}</p>
                    <small><strong>Reads:</strong> {item.reads}</small>
                    <small><strong>Gives:</strong> {item.gives}</small>
                  </article>
                ))}
              </div>
            </section>
            <section className="modal-study-block">
              <h3>Word by word</h3>
              <dl className="word-list">
                {lesson.vocabulary.map((item) => (
                  <div key={item.word}>
                    <dt>{item.word}</dt>
                    <dd>{item.means}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="modal-study-block">
              <h3>Mini study path</h3>
              <ol className="modal-steps">
                {lesson.studySteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      ) : null}
    </main>
  );
}
