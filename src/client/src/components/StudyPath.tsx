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
  {
    step: "1",
    title: "User types a task title",
    path: "src/client/src/App.tsx",
    code: `const [formState, setFormState] = useState({
  id: "",
  title: "",
  description: "",
  completed: false
});`,
    explanation:
      "useState creates React memory. formState is the current value. setFormState is the function used to change that value. The title starts as an empty string because the form starts empty.",
    sends: "The title value becomes available to the input field."
  },
  {
    step: "2",
    title: "React stores the input value",
    path: "src/client/src/App.tsx",
    code: `<input
  value={formState.title}
  onChange={(event) => setFormState({ ...formState, title: event.target.value })}
/>`,
    explanation:
      "value makes this a controlled input, meaning React state controls what appears in the input. onChange runs every time you type. event.target.value is the latest text from the browser input. The spread operator keeps the old form fields and only replaces title.",
    sends: "formState.title now contains the text the user typed."
  },
  {
    step: "3",
    title: "The form submit runs saveTask",
    path: "src/client/src/App.tsx",
    code: `<form className="editor" autoComplete="off" onSubmit={saveTask}>
  ...
</form>`,
    explanation:
      "onSubmit is an event prop. {saveTask} passes the function to React. It does not run immediately. React calls saveTask later when the user presses the submit button or hits Enter inside the form.",
    sends: "React gives saveTask a submit event object."
  },
  {
    step: "4",
    title: "saveTask stops the page reload",
    path: "src/client/src/App.tsx",
    code: `async function saveTask(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  ...
}`,
    explanation:
      "Browsers normally reload the page when a form submits. event.preventDefault() cancels that default behavior so React can send an API request without refreshing the whole app.",
    sends: "The function can continue building the API request."
  },
  {
    step: "5",
    title: "saveTask builds the payload",
    path: "src/client/src/App.tsx",
    code: `const payload = {
  title: formState.title,
  description: formState.description,
  ...(isEditing ? { completed: formState.completed } : {})
};`,
    explanation:
      "payload is the data object sent to the backend. title and description come from React state. The ...(isEditing ? ... : {}) part conditionally adds completed only when editing an existing task.",
    sends: "A JavaScript object ready to become JSON."
  },
  {
    step: "6",
    title: "saveTask chooses POST or PUT",
    path: "src/client/src/App.tsx",
    code: `const isEditing = Boolean(formState.id);

await apiRequest<TaskResponse>(
  isEditing ? "PUT" : "POST",
  isEditing ? \`\${apiUrl}/\${formState.id}\` : apiUrl,
  payload,
  isEditing ? "Save edit" : "Create task"
);`,
    explanation:
      "Boolean(formState.id) checks if there is an id. No id means this is a new task, so the method is POST and the URL is /api/tasks. Existing id means edit, so the method is PUT and the URL includes /:id.",
    sends: "apiRequest receives method, URL, body, and a label for the API history panel."
  },
  {
    step: "7",
    title: "apiRequest prepares fetch options",
    path: "src/client/src/App.tsx",
    code: `const options: RequestInit = {
  method,
  headers: {}
};

if (body) {
  options.headers = { "Content-Type": "application/json" };
  options.body = JSON.stringify(body);
}`,
    explanation:
      "RequestInit is the TypeScript type for fetch options. method becomes POST. Content-Type tells Express the body is JSON. JSON.stringify converts the JavaScript object into JSON text because HTTP cannot send live JavaScript objects.",
    sends: "fetch receives a URL plus options containing method, headers, and body."
  },
  {
    step: "8",
    title: "fetch sends the HTTP request",
    path: "src/client/src/App.tsx",
    code: `const response = await fetch(url, options);
const result = await response.json();`,
    explanation:
      "fetch is the browser API for making HTTP requests. await pauses this async function until the server responds. response.json() reads the JSON response body and turns it back into a JavaScript object.",
    sends: "The request leaves the frontend and reaches the Express backend."
  },
  {
    step: "9",
    title: "Express receives and parses JSON",
    path: "src/app.ts",
    code: `const app = express();

app.use(express.json());`,
    explanation:
      "express() creates the backend app. app.use adds middleware to the request pipeline. express.json() looks at JSON requests and creates req.body for controllers to read.",
    sends: "The parsed body is attached to req.body."
  },
  {
    step: "10",
    title: "Express sends /api/tasks to the task router",
    path: "src/app.ts",
    code: `app.use("/api/tasks", taskRoutes);`,
    explanation:
      "This mounts the router. Any request starting with /api/tasks is handed to taskRoutes. The router then only has to care about the remaining part of the URL.",
    sends: "POST /api/tasks becomes POST / inside taskRoutes.ts."
  },
  {
    step: "11",
    title: "The router chooses createTask",
    path: "src/routes/taskRoutes.ts",
    code: `router.post("/", createTask);`,
    explanation:
      "router.post is an Express router method. '/' means the root of this router. Because app.ts mounted the router at /api/tasks, this line handles the full endpoint POST /api/tasks. createTask is a callback Express runs when the request matches.",
    sends: "Express calls createTask(req, res, next)."
  },
  {
    step: "12",
    title: "The controller reads req.body",
    path: "src/controllers/taskController.ts",
    code: `export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as Partial<CreateTaskPayload>;
    ...
  } catch (error) {
    return next(error);
  }
}`,
    explanation:
      "The controller is the HTTP decision maker. req is what came from the frontend. res is how the backend replies. next is how the controller passes unexpected errors to the Express error handler.",
    sends: "payload is passed into validation."
  },
  {
    step: "13",
    title: "The validator checks the input",
    path: "src/validators/taskValidator.ts",
    code: `export function validateCreateTask(payload: Partial<CreateTaskPayload>) {
  if (isMissingText(payload.title)) {
    return "Title is required";
  }

  return null;
}`,
    explanation:
      "Validation protects the backend. Partial<CreateTaskPayload> means the object might be incomplete, so the validator must check it. Returning a string means invalid. Returning null means the data is acceptable.",
    sends: "Valid data continues. Invalid data becomes HTTP 400."
  },
  {
    step: "14",
    title: "The controller calls the repository",
    path: "src/controllers/taskController.ts",
    code: `const task = await create(payload as CreateTaskPayload);

return res.status(201).json({ data: task });`,
    explanation:
      "After validation passes, the controller trusts the payload as CreateTaskPayload. It calls create in the repository. status(201) means created. json({ data: task }) sends the saved task back to the frontend.",
    sends: "The repository receives clean task data."
  },
  {
    step: "15",
    title: "The repository creates the full task object",
    path: "src/repositories/taskRepository.ts",
    code: `const now = new Date().toISOString();
const task: Task = {
  id: randomUUID(),
  title: payload.title.trim(),
  description: payload.description?.trim() || "",
  completed: false,
  createdAt: now,
  updatedAt: now
};`,
    explanation:
      "The frontend only sends title and description. The backend owns id, completed, createdAt, and updatedAt. randomUUID creates a unique id. trim removes accidental spaces.",
    sends: "A complete Task object is ready to save."
  },
  {
    step: "16",
    title: "The repository saves to Postgres or local JSON",
    path: "src/repositories/taskRepository.ts",
    code: `if (pool && usePostgres && !postgresUnavailable) {
  await ensureTasksTable();
  const result = await pool.query(...);
  return rowToTask(result.rows[0]);
}

const tasks = await readTasks();
tasks.push(task);
await writeTasks(tasks);
return task;`,
    explanation:
      "This is the storage decision. If Postgres is configured, the task is inserted into the database. Otherwise the local learning version reads data/tasks.json, pushes the new task into the array, writes the file, and returns the task.",
    sends: "The saved task goes back to the controller."
  },
  {
    step: "17",
    title: "React refreshes the list",
    path: "src/client/src/App.tsx",
    code: `resetForm();
await loadTasks();
setStatusMessage("Task created.");`,
    explanation:
      "After create succeeds, the form is cleared. loadTasks asks the API for the latest list. The status message gives the user feedback.",
    sends: "loadTasks sends a fresh GET /api/tasks request."
  },
  {
    step: "18",
    title: "loadTasks stores the returned tasks",
    path: "src/client/src/App.tsx",
    code: `const result = await apiRequest<TaskListResponse>(
  "GET",
  \`\${apiUrl}\${query}\`,
  null,
  "Automatic refresh"
);

setTasks(result.data);`,
    explanation:
      "TaskListResponse tells TypeScript the expected shape: { count, data }. result.data is the array of tasks. setTasks updates React state.",
    sends: "React has new state, so the UI re-renders."
  },
  {
    step: "19",
    title: "React redraws the visible list",
    path: "src/client/src/App.tsx",
    code: `{visibleTasks.map((task) => (
  <li className="task-item" key={task.id}>
    <p className="task-title">{task.title}</p>
  </li>
))}`,
    explanation:
      "map loops over the task array and returns JSX for each task. key={task.id} helps React track each list item. The saved task is now visible on screen.",
    sends: "The create flow is finished from browser to backend to storage and back."
  }
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
          Read these cards while creating one task in the app. Each card shows the exact code piece, the file path, what it means,
          and what that step passes to the next layer.
        </p>
        <div className="trace-card-list">
          {requestTrace.map((item) => (
            <article className="trace-card" key={item.step}>
              <div className="trace-card-number">{item.step}</div>
              <div className="trace-card-body">
                <div className="trace-card-header">
                  <h3>{item.title}</h3>
                  <code>{item.path}</code>
                </div>
                <pre><code>{item.code}</code></pre>
                <p>{item.explanation}</p>
                <small><strong>Passes next:</strong> {item.sends}</small>
              </div>
            </article>
          ))}
        </div>
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
