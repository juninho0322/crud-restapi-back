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
}`
  },
  express: {
    title: "Express App",
    file: "src/app.ts",
    path: "src/app.ts",
    role: "receives",
    explanation: "This creates the Express app, serves the React build, reads JSON bodies, and mounts task routes.",
    code: `app.use(express.json());
app.use(express.static(clientBuildDirectory));
app.use("/api/tasks", taskRoutes);`
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
router.delete("/:id", deleteTask);`
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
}`
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
}`
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
}`
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
]`
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
);`
  }
};

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
  const [activeNode, setActiveNode] = useState<DiagramNodeKey>("frontend");
  const lesson = nodeLessons[activeNode];

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

      <div className="code-popover visible" role="dialog" aria-live="polite" aria-label="Code explanation">
        <div className="popover-header">
          <div>
            <p id="popover-file">{lesson.file}</p>
            <h2>{lesson.title}</h2>
          </div>
          <span>{lesson.role}</span>
        </div>
        <div className="path-row">
          <strong>Path</strong>
          <code>{lesson.path}</code>
        </div>
        <p className="popover-explanation">{lesson.explanation}</p>
        <pre><code>{lesson.code}</code></pre>
      </div>
    </main>
  );
}
