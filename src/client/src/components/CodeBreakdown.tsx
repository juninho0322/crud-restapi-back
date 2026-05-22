const backendTerms = [
  {
    term: "API",
    simple: "The contract between your frontend and backend.",
    detail:
      "An API says which URLs exist, which HTTP methods they accept, what JSON the frontend should send, and what JSON the backend will return. In this project, /api/tasks is the API surface your React app calls."
  },
  {
    term: "Endpoint",
    simple: "One specific API URL plus method.",
    detail:
      "GET /api/tasks and POST /api/tasks are different endpoints even though the URL is similar, because the HTTP method changes the meaning."
  },
  {
    term: "Route",
    simple: "The backend version of an event listener for a URL.",
    detail:
      "In React, you might say onClick={saveTask}. In Express, you say router.post('/', createTask). A route waits for an HTTP request and sends it to a controller."
  },
  {
    term: "Controller",
    simple: "The request handler that decides what to do.",
    detail:
      "Controllers read req.body, req.params, or req.query, call validation/data functions, and send the response with res.json or res.status(...).json(...)."
  },
  {
    term: "Repository",
    simple: "The data access layer.",
    detail:
      "Controllers do not need to know if data is in JSON, memory, or Supabase. They call repository functions like create(), findAll(), update(), and remove()."
  },
  {
    term: "Middleware",
    simple: "Code that runs during the request pipeline.",
    detail:
      "express.json() is middleware. It reads incoming JSON and makes it available as req.body. The error handler is also middleware."
  },
  {
    term: "req",
    simple: "The request object.",
    detail:
      "req contains what the frontend sent: req.body for JSON body, req.params for URL parts like :id, and req.query for ?completed=true."
  },
  {
    term: "res",
    simple: "The response object.",
    detail:
      "res is how the backend answers the frontend. Examples: res.json({ data }) or res.status(201).json({ data })."
  },
  {
    term: "Status code",
    simple: "A number that tells the frontend what happened.",
    detail:
      "200 means success, 201 means created, 204 means success with no body, 400 means bad input, 404 means not found, and 500 means server error."
  }
];

const fileWalkthrough = [
  {
    path: "src/client/src/App.tsx",
    purpose: "React dashboard, form state, task list, fetch calls, API history, and study panels.",
    readFor: "Find apiRequest(), saveTask(), loadTasks(), toggleTask(), and deleteTask()."
  },
  {
    path: "src/app.ts",
    purpose: "Creates the Express app. Connects middleware, React static build, health route, task API routes, and error handlers.",
    readFor: "Find app.use(express.json()), app.use('/api/tasks', taskRoutes), and app.use(errorHandler)."
  },
  {
    path: "src/routes/taskRoutes.ts",
    purpose: "Maps HTTP methods and URLs to controller functions.",
    readFor: "Read it like a menu: GET goes to listTasks, POST goes to createTask, PUT goes to updateTask."
  },
  {
    path: "src/controllers/taskController.ts",
    purpose: "Owns request and response logic for tasks.",
    readFor: "Look for req.body, req.params.id, validation, repository calls, and res.status(...).json(...)."
  },
  {
    path: "src/validators/taskValidator.ts",
    purpose: "Protects the backend from invalid input.",
    readFor: "Notice that backend validation still matters even if the frontend has required fields."
  },
  {
    path: "src/repositories/taskRepository.ts",
    purpose: "Reads and writes data. Chooses local JSON, temporary memory, or Supabase/Postgres.",
    readFor: "Find create(), findAll(), update(), remove(), and getStorageStatus()."
  },
  {
    path: "tests/tasks.test.ts",
    purpose: "Automated proof that the API can create, list, update, delete, and validate tasks.",
    readFor: "Notice the tests call Express directly with supertest instead of using the browser."
  }
];

const requestFlow = `1. React form submits
   src/client/src/App.tsx -> saveTask()

2. React calls the API
   apiRequest("POST", "/api/tasks", payload)

3. Express receives the request
   src/app.ts -> app.use("/api/tasks", taskRoutes)

4. Router chooses a controller
   src/routes/taskRoutes.ts -> router.post("/", createTask)

5. Controller validates and delegates
   src/controllers/taskController.ts -> validateCreateTask(req.body)
   src/controllers/taskController.ts -> create(req.body)

6. Repository saves data
   src/repositories/taskRepository.ts -> local JSON or Supabase

7. Backend responds
   res.status(201).json({ data: task })

8. React updates state
   setTasks(...) -> JSX re-renders the UI`;

const codePieces = [
  {
    title: "Function",
    path: "src/controllers/taskController.ts",
    code: `export async function createTask(req, res, next) {
  const task = await create(req.body);
  return res.status(201).json({ data: task });
}`,
    explanation:
      "A function is a reusable block of code. createTask runs whenever the POST /api/tasks route calls it. It receives request tools as parameters, does work, then returns a response."
  },
  {
    title: "Parameters",
    path: "src/controllers/taskController.ts",
    code: `function createTask(req, res, next)`,
    explanation:
      "Parameters are named inputs a function receives. req is the request from the frontend, res is the response object used to answer, and next passes errors to Express error middleware."
  },
  {
    title: "Method",
    path: "src/routes/taskRoutes.ts",
    code: `router.post("/", createTask);`,
    explanation:
      "A method is a function that belongs to an object. post is a method on router. It means: when a POST request arrives at this route, run createTask."
  },
  {
    title: "Callback",
    path: "src/routes/taskRoutes.ts",
    code: `router.get("/", listTasks);`,
    explanation:
      "A callback is a function passed into another function to be called later. listTasks is passed to router.get, but Express calls it later when a matching HTTP request arrives."
  },
  {
    title: "Async / await",
    path: "src/client/src/App.tsx",
    code: `const response = await fetch(url, options);
const result = await response.json();`,
    explanation:
      "async code waits for slow work, like network requests. await pauses this function until fetch finishes, without freezing the whole browser."
  },
  {
    title: "Object",
    path: "src/repositories/taskRepository.ts",
    code: `const task = {
  id: randomUUID(),
  title: payload.title.trim(),
  completed: false
};`,
    explanation:
      "An object groups related values together. A task object has fields like id, title, description, completed, createdAt, and updatedAt."
  },
  {
    title: "Type",
    path: "src/types/task.ts",
    code: `export type Task = {
  id: string;
  title: string;
  completed: boolean;
};`,
    explanation:
      "A TypeScript type describes the shape of data. It helps you know what fields a task must have and catches mistakes before the app runs."
  },
  {
    title: "Import / export",
    path: "src/controllers/taskController.ts",
    code: `import { create } from "../repositories/taskRepository.js";

export async function createTask(...) {}`,
    explanation:
      "export makes code available to other files. import brings code from another file. This is how controllers use repository functions without putting all code in one file."
  },
  {
    title: "Destructuring",
    path: "src/controllers/taskController.ts",
    code: `const { completed, search } = req.query;`,
    explanation:
      "Destructuring pulls properties out of an object. This line reads completed and search from req.query, which comes from URL query params."
  },
  {
    title: "Array methods",
    path: "src/repositories/taskRepository.ts",
    code: `filteredTasks = filteredTasks.filter((task) => {
  return task.completed === completed;
});`,
    explanation:
      "filter is an array method. It loops through the array and keeps only the items where the callback returns true."
  },
  {
    title: "React state setter",
    path: "src/client/src/App.tsx",
    code: `setApiHistory((history) => [call, ...history].slice(0, 8));`,
    explanation:
      "setApiHistory updates React state. The callback receives the previous history, adds the new call at the front, and keeps only the latest 8 items."
  },
  {
    title: "HTTP method vs JavaScript method",
    path: "src/routes/taskRoutes.ts",
    code: `router.post("/", createTask);

fetch("/api/tasks", { method: "POST" });`,
    explanation:
      "POST is an HTTP method: the meaning of the request. router.post is a JavaScript method: a function on the Express router object that registers the POST endpoint."
  }
];

export function CodeBreakdown() {
  return (
    <main className="learning-shell">
      <header className="learning-header">
        <div>
          <p className="eyebrow">CRUD Study</p>
          <h1>Code Breakdown</h1>
          <p>
            A student-friendly guide to the backend/API terminology, the TypeScript files, and the full request flow from React to Supabase.
          </p>
        </div>
        <nav className="diagram-nav" aria-label="Breakdown navigation">
          <a href="/">Back to app</a>
          <a href="/diagram.html">Diagram</a>
        </nav>
      </header>

      <section className="learning-panel">
        <h2>The Big Idea</h2>
        <p>
          Your React frontend is the visible part. The API is the contract it uses to ask the server for data work. Express is the server
          code that receives those requests. The repository is the data layer that actually reads or writes storage.
        </p>
        <pre>{`React does not talk to Supabase directly in this project.

React -> HTTP request -> Express route -> Controller -> Repository -> Storage`}</pre>
      </section>

      <section className="learning-panel">
        <h2>Full Create Request Flow</h2>
        <pre>{requestFlow}</pre>
      </section>

      <section className="learning-panel">
        <h2>Backend And API Terms</h2>
        <div className="term-grid">
          {backendTerms.map((item) => (
            <article className="term-card" key={item.term}>
              <h3>{item.term}</h3>
              <strong>{item.simple}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-panel">
        <h2>Coding Pieces Explained</h2>
        <p>
          This section explains the small coding building blocks you keep seeing: functions, methods, parameters, callbacks, objects,
          types, imports, async/await, and array methods.
        </p>
        <div className="code-piece-list">
          {codePieces.map((piece) => (
            <article className="code-piece-card" key={piece.title}>
              <div className="code-piece-header">
                <h3>{piece.title}</h3>
                <code>{piece.path}</code>
              </div>
              <pre><code>{piece.code}</code></pre>
              <p>{piece.explanation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-panel">
        <h2>File-By-File Reading Plan</h2>
        <div className="file-list">
          {fileWalkthrough.map((file) => (
            <article className="file-card" key={file.path}>
              <code>{file.path}</code>
              <p>{file.purpose}</p>
              <small>{file.readFor}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-panel">
        <h2>Advanced Frontend Concepts Used Here</h2>
        <div className="term-grid">
          <article className="term-card">
            <h3>Controlled form</h3>
            <p>React state owns the input values. When you type, onChange updates state. When state changes, React re-renders the input.</p>
          </article>
          <article className="term-card">
            <h3>Async/await</h3>
            <p>The frontend waits for the API response before updating status messages and refreshing the task list.</p>
          </article>
          <article className="term-card">
            <h3>Derived state</h3>
            <p>visibleTasks is calculated from tasks plus activeFilter. It is not separately saved in the database.</p>
          </article>
          <article className="term-card">
            <h3>Type contracts</h3>
            <p>Task, ApiMethod, and payload types document what shapes the frontend expects while the backend has its own matching types.</p>
          </article>
        </div>
      </section>

      <section className="learning-panel">
        <h2>Study Checklist</h2>
        <ol className="learning-list">
          <li>Create a task and explain every file involved.</li>
          <li>Open the Network tab and find POST /api/tasks.</li>
          <li>Find the matching route in taskRoutes.ts.</li>
          <li>Find where req.body is validated.</li>
          <li>Find where the repository chooses Postgres or local JSON.</li>
          <li>Explain why React should not directly write to the database in this architecture.</li>
        </ol>
      </section>
    </main>
  );
}
