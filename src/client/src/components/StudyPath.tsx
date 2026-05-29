const levels = [
  {
    level: "Level 1",
    title: "Basic Web Concepts",
    goal: "Understand the words before reading the code.",
    topics: [
      {
        name: "Frontend",
        path: "src/client/src/App.tsx",
        explanation:
          "The frontend is the part the user sees and clicks. In this project, React renders the form, task list, filters, and study panels.",
        snippet: `<button type="submit">Create task</button>`
      },
      {
        name: "Backend",
        path: "src/app.ts",
        explanation:
          "The backend is the server code. It receives HTTP requests, validates data, calls storage code, and sends JSON responses.",
        snippet: `app.use("/api/tasks", taskRoutes);`
      },
      {
        name: "API",
        path: "src/routes/taskRoutes.ts",
        explanation:
          "An API is the contract between frontend and backend. It defines URLs, methods, request bodies, and response bodies.",
        snippet: `POST /api/tasks -> create a task`
      },
      {
        name: "JSON",
        path: "src/client/src/App.tsx",
        explanation:
          "JSON is the data format sent between React and Express. React sends JSON text; Express parses it into req.body.",
        snippet: `JSON.stringify({ title: "Study API" })`
      }
    ]
  },
  {
    level: "Level 2",
    title: "JavaScript And TypeScript Building Blocks",
    goal: "Read the syntax you keep seeing in this project.",
    topics: [
      {
        name: "Function",
        path: "src/controllers/taskController.ts",
        explanation:
          "A function is a reusable block of code. createTask runs every time Express receives POST /api/tasks.",
        snippet: `export async function createTask(req, res, next) {}`
      },
      {
        name: "Parameter",
        path: "src/controllers/taskController.ts",
        explanation:
          "Parameters are values a function receives. req is the request, res is the response, and next passes errors forward.",
        snippet: `function createTask(req, res, next)`
      },
      {
        name: "Callback",
        path: "src/routes/taskRoutes.ts",
        explanation:
          "A callback is a function given to another function to run later. Express runs createTask later when a matching request arrives.",
        snippet: `router.post("/", createTask);`
      },
      {
        name: "Method",
        path: "src/routes/taskRoutes.ts",
        explanation:
          "A method is a function that belongs to an object. post is a method on router. It registers a POST endpoint.",
        snippet: `router.post("/", createTask);`
      },
      {
        name: "Object",
        path: "src/repositories/taskRepository.ts",
        explanation:
          "An object groups related values. A task object has id, title, description, completed, createdAt, and updatedAt.",
        snippet: `const task = { id, title, completed: false };`
      },
      {
        name: "Type",
        path: "src/types/task.ts",
        explanation:
          "A TypeScript type describes the shape of data. It helps you know what fields exist before the app runs.",
        snippet: `export type Task = { id: string; title: string; completed: boolean; };`
      },
      {
        name: "Async / await",
        path: "src/client/src/App.tsx",
        explanation:
          "async/await handles slow work like API calls. await pauses this function until fetch or database work finishes.",
        snippet: `const response = await fetch(url, options);`
      },
      {
        name: "Import / export",
        path: "Many files",
        explanation:
          "export shares code from one file. import brings that code into another file. This is what connects the project files.",
        snippet: `import { create } from "../repositories/taskRepository.js";`
      }
    ]
  },
  {
    level: "Level 3",
    title: "React Frontend Flow",
    goal: "Understand how the screen creates API requests.",
    topics: [
      {
        name: "Component",
        path: "src/client/src/App.tsx",
        explanation:
          "App is a React component. It returns JSX, which describes the UI shown in the browser.",
        snippet: `export default function App() { return <main>...</main>; }`
      },
      {
        name: "State",
        path: "src/client/src/App.tsx",
        explanation:
          "State is React memory. formState stores what the user typed. tasks stores what came back from the API.",
        snippet: `const [tasks, setTasks] = useState<Task[]>([]);`
      },
      {
        name: "Controlled input",
        path: "src/client/src/App.tsx",
        explanation:
          "The input value comes from state. When the user types, onChange updates state, then React redraws the input.",
        snippet: `value={formState.title}
onChange={(event) => setFormState({ ...formState, title: event.target.value })}`
      },
      {
        name: "Submit event",
        path: "src/client/src/App.tsx",
        explanation:
          "The form submit event starts create/update. event.preventDefault() stops the browser from reloading the page.",
        snippet: `async function saveTask(event) {
  event.preventDefault();
}`
      },
      {
        name: "fetch",
        path: "src/client/src/App.tsx",
        explanation:
          "fetch is the browser function that sends HTTP requests to the backend API.",
        snippet: `fetch("/api/tasks", { method: "POST", body: JSON.stringify(payload) })`
      }
    ]
  },
  {
    level: "Level 4",
    title: "REST API And Express Backend",
    goal: "Understand how the backend receives and answers requests.",
    topics: [
      {
        name: "Express app",
        path: "src/app.ts",
        explanation:
          "The Express app is the backend application. It wires middleware, routes, static frontend files, and error handlers.",
        snippet: `const app = express();`
      },
      {
        name: "Middleware",
        path: "src/app.ts",
        explanation:
          "Middleware runs during the request pipeline. express.json() converts incoming JSON text into req.body.",
        snippet: `app.use(express.json());`
      },
      {
        name: "Route",
        path: "src/routes/taskRoutes.ts",
        explanation:
          "A route maps a method and URL to a controller. It is like a traffic sign for requests.",
        snippet: `router.get("/", listTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);`
      },
      {
        name: "Controller",
        path: "src/controllers/taskController.ts",
        explanation:
          "A controller understands HTTP. It reads req.body, req.params, and req.query, then sends res.json or status codes.",
        snippet: `return res.status(201).json({ data: task });`
      },
      {
        name: "Status code",
        path: "src/controllers/taskController.ts",
        explanation:
          "Status codes tell the frontend what happened. 200 is success, 201 created, 204 deleted, 400 bad input, 404 not found.",
        snippet: `res.status(400).json({ message: validationError })`
      },
      {
        name: "Validation",
        path: "src/validators/taskValidator.ts",
        explanation:
          "Validation protects the backend. Even if the frontend has required fields, the backend must still reject bad data.",
        snippet: `if (isMissingText(payload.title)) return "Title is required";`
      }
    ]
  },
  {
    level: "Level 5",
    title: "Data Layer And Storage",
    goal: "Understand where tasks are saved.",
    topics: [
      {
        name: "Repository pattern",
        path: "src/repositories/taskRepository.ts",
        explanation:
          "The repository is the only layer that knows storage details. Controllers ask for create, findAll, update, and remove.",
        snippet: `const task = await create(payload);`
      },
      {
        name: "Local JSON storage",
        path: "data/tasks.json",
        explanation:
          "For local learning, tasks can be saved into a JSON file. This makes it easy to inspect saved data.",
        snippet: `[
  { "id": "uuid", "title": "Study API", "completed": false }
]`
      },
      {
        name: "Postgres / Supabase",
        path: "src/repositories/taskRepository.ts",
        explanation:
          "On Vercel, Supabase Postgres gives you real persistent database storage. DATABASE_URL tells the repository to use Postgres.",
        snippet: `INSERT INTO tasks (id, title, description, completed, created_at, updated_at)`
      },
      {
        name: "Environment variable",
        path: ".env.example",
        explanation:
          "An environment variable stores configuration outside the code, like the database connection string.",
        snippet: `DATABASE_URL=postgresql://...`
      }
    ]
  },
  {
    level: "Level 6",
    title: "Production, Tests, And Advanced Ideas",
    goal: "Understand how this project becomes reliable and deployable.",
    topics: [
      {
        name: "Build output",
        path: "dist/",
        explanation:
          "dist is generated by npm run build. You study src first. dist is the compiled version Node and Vercel can run.",
        snippet: `src/app.ts -> dist/server/src/app.js`
      },
      {
        name: "Vercel serverless entry",
        path: "api/index.ts",
        explanation:
          "Vercel looks inside api/. This file exports the same Express app, so deployment uses the same backend logic.",
        snippet: `import app from "../src/app.js";
export default app;`
      },
      {
        name: "Automated test",
        path: "tests/tasks.test.ts",
        explanation:
          "Tests call the API without using the browser. They prove create, list, update, delete, and validation still work.",
        snippet: `await request(app).post("/api/tasks").send({ title: "Study CRUD" });`
      },
      {
        name: "Type checking",
        path: "tsconfig.json",
        explanation:
          "TypeScript checks your code before it runs. It catches many shape and import mistakes early.",
        snippet: `npm run typecheck`
      },
      {
        name: "Separation of concerns",
        path: "Whole project",
        explanation:
          "Each layer has one job: React shows UI, routes map URLs, controllers handle HTTP, validators check input, repositories save data.",
        snippet: `UI -> API -> Route -> Controller -> Repository -> Storage`
      }
    ]
  }
];

const requestTrace = [
  "User types a task title in React.",
  "React stores the text in formState.",
  "The form submit runs saveTask.",
  "saveTask builds a payload object.",
  "apiRequest sends POST /api/tasks with JSON.",
  "Express receives the request in src/app.ts.",
  "express.json() turns JSON into req.body.",
  "taskRoutes sends POST / to createTask.",
  "createTask validates req.body.",
  "createTask calls repository create(payload).",
  "The repository saves to Postgres or data/tasks.json.",
  "The controller returns status 201 and { data: task }.",
  "React calls loadTasks.",
  "loadTasks sends GET /api/tasks.",
  "setTasks stores the returned list.",
  "React re-renders the task list on screen."
];

const endpoints = [
  ["GET", "/api/tasks", "Read all tasks", "loadTasks", "listTasks", "findAll"],
  ["GET", "/api/tasks/:id", "Read one task", "future detail screen or raw API", "getTaskById", "findById"],
  ["POST", "/api/tasks", "Create one task", "saveTask", "createTask", "create"],
  ["PUT", "/api/tasks/:id", "Update one task", "saveTask or toggleTask", "updateTask", "update"],
  ["DELETE", "/api/tasks/:id", "Delete one task", "deleteTask", "deleteTask", "remove"]
];

export function StudyPath() {
  return (
    <main className="learning-shell">
      <header className="learning-header">
        <div>
          <p className="eyebrow">CRUD Study</p>
          <h1>Complete Study Path</h1>
          <p>
            A separate learning page that breaks this project down from basic concepts to advanced backend, API, database,
            deployment, testing, and frontend integration ideas.
          </p>
        </div>
        <nav className="diagram-nav" aria-label="Study path navigation">
          <a href="/">Back to app</a>
          <a href="/diagram.html">Diagram</a>
          <a href="/breakdown">Code breakdown</a>
        </nav>
      </header>

      <section className="learning-panel study-focus-panel">
        <h2>The Whole Project In One Sentence</h2>
        <p>
          The user clicks something in React, React sends an HTTP request to Express, Express chooses a route and controller,
          the controller asks the repository to read or write storage, then JSON comes back and React redraws the screen.
        </p>
        <pre>{`React UI
  -> fetch("/api/tasks")
  -> Express app
  -> task route
  -> task controller
  -> validator
  -> repository
  -> JSON file or Supabase Postgres
  -> JSON response
  -> React state
  -> updated screen`}</pre>
      </section>

      <section className="learning-panel">
        <h2>Trace The Create Flow From Start To Finish</h2>
        <p>
          Read this list while creating one task in the app. This is the exact path your data travels.
        </p>
        <ol className="trace-list">
          {requestTrace.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="learning-panel">
        <h2>REST API Map</h2>
        <p>
          Every CRUD action has a method, URL, frontend function, backend controller, and repository function.
        </p>
        <div className="endpoint-study-grid">
          {endpoints.map(([method, url, meaning, frontend, controller, repository]) => (
            <article className="endpoint-study-card" key={`${method} ${url}`}>
              <div>
                <span>{method}</span>
                <code>{url}</code>
              </div>
              <p>{meaning}</p>
              <small><strong>Frontend:</strong> {frontend}</small>
              <small><strong>Controller:</strong> {controller}</small>
              <small><strong>Repository:</strong> {repository}</small>
            </article>
          ))}
        </div>
      </section>

      {levels.map((level) => (
        <section className="learning-panel" key={level.level}>
          <h2>{level.level}: {level.title}</h2>
          <p>{level.goal}</p>
          <div className="concept-study-grid">
            {level.topics.map((topic) => (
              <article className="concept-study-card" key={`${level.level}-${topic.name}`}>
                <div className="concept-study-header">
                  <h3>{topic.name}</h3>
                  <code>{topic.path}</code>
                </div>
                <pre><code>{topic.snippet}</code></pre>
                <p>{topic.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="learning-panel">
        <h2>How To Study This Project</h2>
        <ol className="learning-list">
          <li>Use the app first: create, edit, complete, delete, and filter tasks.</li>
          <li>Open <code>src/client/src/App.tsx</code> and find the function that matches the action you used.</li>
          <li>Follow the API call into <code>src/app.ts</code>, then <code>src/routes/taskRoutes.ts</code>.</li>
          <li>Read the controller that matches the route and identify <code>req</code>, <code>res</code>, validation, and repository calls.</li>
          <li>Open the repository and identify whether it uses local JSON or Postgres.</li>
          <li>Run <code>npm test</code> and match each test to one CRUD endpoint.</li>
          <li>Run <code>npm run build</code> and remember that <code>dist/</code> is generated output, not the main study source.</li>
        </ol>
      </section>
    </main>
  );
}
