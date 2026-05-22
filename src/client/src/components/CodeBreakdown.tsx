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
    order: 1,
    path: "src/client/src/App.tsx",
    purpose: "React dashboard, form state, task list, fetch calls, API history, and study panels.",
    talksTo: "Calls the backend API with fetch(). It does not talk to the database directly.",
    readFor: "Find apiRequest(), saveTask(), loadTasks(), toggleTask(), and deleteTask().",
    exercise: "Change the task title in the form, submit it, then find which function created the POST request."
  },
  {
    order: 2,
    path: "src/app.ts",
    purpose: "Creates the Express app. Connects middleware, React static build, health route, task API routes, and error handlers.",
    talksTo: "Receives browser/API traffic, sends /api/tasks traffic to the router, and serves the built React app.",
    readFor: "Find app.use(express.json()), app.use('/api/tasks', taskRoutes), and app.use(errorHandler).",
    exercise: "Visit /health in the browser and connect that response back to this file."
  },
  {
    order: 3,
    path: "src/routes/taskRoutes.ts",
    purpose: "Maps HTTP methods and URLs to controller functions.",
    talksTo: "Receives requests from app.ts and passes them to controller functions.",
    readFor: "Read it like a menu: GET goes to listTasks, POST goes to createTask, PUT goes to updateTask.",
    exercise: "Write down every endpoint: method, URL, and controller name."
  },
  {
    order: 4,
    path: "src/controllers/taskController.ts",
    purpose: "Owns request and response logic for tasks.",
    talksTo: "Receives req/res from Express, calls validators, calls the repository, then sends JSON responses.",
    readFor: "Look for req.body, req.params.id, validation, repository calls, and res.status(...).json(...).",
    exercise: "Follow createTask line by line and explain where the input comes from and where the response is sent."
  },
  {
    order: 5,
    path: "src/validators/taskValidator.ts",
    purpose: "Protects the backend from invalid input.",
    talksTo: "Used by controllers before data reaches the repository.",
    readFor: "Notice that backend validation still matters even if the frontend has required fields.",
    exercise: "Try sending an empty title and connect the 400 error to the validation code."
  },
  {
    order: 6,
    path: "src/repositories/taskRepository.ts",
    purpose: "Reads and writes data. Chooses local JSON, temporary memory, or Supabase/Postgres.",
    talksTo: "Talks to the storage system: local JSON in development, memory fallback, or Supabase/Postgres in production.",
    readFor: "Find create(), findAll(), update(), remove(), and getStorageStatus().",
    exercise: "Create a task, then find the repository function that writes it."
  },
  {
    order: 7,
    path: "src/types/task.ts",
    purpose: "Defines the TypeScript shapes used by backend task data.",
    talksTo: "Imported by backend files so they agree about what a Task looks like.",
    readFor: "Compare Task, CreateTaskPayload, and UpdateTaskPayload.",
    exercise: "Explain why creating a task does not need an id, but a saved task always has one."
  },
  {
    order: 8,
    path: "tests/tasks.test.ts",
    purpose: "Automated proof that the API can create, list, update, delete, and validate tasks.",
    talksTo: "Imports the Express app and sends fake HTTP requests with supertest.",
    readFor: "Notice the tests call Express directly with supertest instead of using the browser.",
    exercise: "Run npm test, then match each test action to an endpoint."
  }
];

const learningPath = [
  {
    step: "1",
    title: "Use the app first",
    goal: "Understand the feature before reading the implementation.",
    files: ["Browser page: /"],
    learn:
      "Create, edit, complete, filter, and delete tasks. Watch the API history panel each time. The UI is showing you which HTTP request just happened.",
    example: "When you create a task, the browser sends POST /api/tasks with JSON body { title, description, completed }."
  },
  {
    step: "2",
    title: "Understand the API contract",
    goal: "Know what the frontend is allowed to ask the backend.",
    files: ["src/routes/taskRoutes.ts", "src/controllers/taskController.ts"],
    learn:
      "Write down the endpoint list: GET /api/tasks, POST /api/tasks, PUT /api/tasks/:id, DELETE /api/tasks/:id. This is the contract between frontend and backend.",
    example: "POST means create. GET means read. PUT means update. DELETE means remove."
  },
  {
    step: "3",
    title: "Follow one request end to end",
    goal: "Trace one action through every layer instead of trying to memorize everything.",
    files: ["src/client/src/App.tsx", "src/app.ts", "src/routes/taskRoutes.ts", "src/controllers/taskController.ts", "src/repositories/taskRepository.ts"],
    learn:
      "Start with saveTask() in React, then follow the request into Express, then route, controller, repository, storage, response, and React state update.",
    example: "saveTask() -> fetch() -> app.use('/api/tasks') -> router.post() -> createTask() -> create() -> res.status(201).json(...)."
  },
  {
    step: "4",
    title: "Learn the backend layers",
    goal: "Know why the project is split into files.",
    files: ["src/app.ts", "src/routes/taskRoutes.ts", "src/controllers/taskController.ts", "src/repositories/taskRepository.ts"],
    learn:
      "app.ts wires the server. routes choose the controller. controllers understand HTTP. repositories understand storage. This separation keeps each file easier to reason about.",
    example: "The controller says 'create a task'. The repository decides how that task is actually saved."
  },
  {
    step: "5",
    title: "Learn the code building blocks",
    goal: "Read TypeScript/JavaScript syntax without getting lost.",
    files: ["src/controllers/taskController.ts", "src/repositories/taskRepository.ts", "src/client/src/App.tsx"],
    learn:
      "Focus on functions, parameters, callbacks, objects, array methods, async/await, imports, exports, and TypeScript types. These are the repeated patterns everywhere.",
    example: "router.post('/', createTask) passes createTask as a callback. Express calls it later when a POST request arrives."
  },
  {
    step: "6",
    title: "Study validation and errors",
    goal: "Understand how a backend protects itself.",
    files: ["src/validators/taskValidator.ts", "src/controllers/taskController.ts", "src/app.ts"],
    learn:
      "The frontend can help users, but the backend must still validate. Bad input returns 400. Missing records return 404. Unexpected failures go to the error handler.",
    example: "An empty title should not reach the database. Validation stops it first."
  },
  {
    step: "7",
    title: "Study storage",
    goal: "Understand where data lives and why Supabase appears in the project.",
    files: ["src/repositories/taskRepository.ts", ".env.example", "docs/VERCEL_DEPLOY.md"],
    learn:
      "The repository can use local JSON, temporary memory, or Postgres. On Vercel, real saved data needs DATABASE_URL or POSTGRES_URL pointing to Supabase.",
    example: "If /health says storage: 'postgres', the API is connected to Postgres."
  },
  {
    step: "8",
    title: "Read the tests",
    goal: "Use tests as executable documentation.",
    files: ["tests/tasks.test.ts"],
    learn:
      "The tests show the API behavior without needing the browser. They create a task, list tasks, update one, delete one, and check validation.",
    example: "supertest(app).post('/api/tasks').send(...) behaves like a frontend POST request."
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

const codeConnectionFlow = [
  {
    number: "1",
    label: "User event",
    concept: "Event handler function",
    file: "src/client/src/App.tsx",
    code: "onSubmit={saveTask}",
    receives: "A browser submit event from the form.",
    sends: "Calls saveTask(), the frontend function that begins the create flow."
  },
  {
    number: "2",
    label: "Frontend function",
    concept: "async function + parameters",
    file: "src/client/src/App.tsx",
    code: "saveTask() -> apiRequest('POST', '/api/tasks', payload)",
    receives: "React state values from the form: title, description, and completed.",
    sends: "Passes method, URL, and payload into the reusable API helper."
  },
  {
    number: "3",
    label: "Fetch helper",
    concept: "HTTP method + JSON body",
    file: "src/client/src/App.tsx",
    code: "fetch('/api/tasks', { method: 'POST', body: JSON.stringify(payload) })",
    receives: "A JavaScript object payload from saveTask().",
    sends: "An HTTP request to the backend API."
  },
  {
    number: "4",
    label: "Express app",
    concept: "Middleware pipeline",
    file: "src/app.ts",
    code: "app.use(express.json()); app.use('/api/tasks', taskRoutes);",
    receives: "The HTTP request from fetch().",
    sends: "Parsed JSON on req.body and forwards /api/tasks to the router."
  },
  {
    number: "5",
    label: "Route",
    concept: "Router method + callback",
    file: "src/routes/taskRoutes.ts",
    code: "router.post('/', createTask);",
    receives: "A POST request whose path matches /api/tasks.",
    sends: "Calls createTask later as the callback for this request."
  },
  {
    number: "6",
    label: "Controller",
    concept: "req, res, next parameters",
    file: "src/controllers/taskController.ts",
    code: "createTask(req, res, next)",
    receives: "req.body from Express and response tools from res.",
    sends: "Valid data to the repository, or errors to next(error)."
  },
  {
    number: "7",
    label: "Validator",
    concept: "Guard function",
    file: "src/validators/taskValidator.ts",
    code: "validateCreateTask(req.body)",
    receives: "Raw input from the frontend.",
    sends: "Clean payload forward, or a 400-style error if input is invalid."
  },
  {
    number: "8",
    label: "Repository",
    concept: "Data access function",
    file: "src/repositories/taskRepository.ts",
    code: "create(payload)",
    receives: "Validated task data from the controller.",
    sends: "A saved task object from JSON storage or Postgres."
  },
  {
    number: "9",
    label: "Response",
    concept: "Status code + JSON response",
    file: "src/controllers/taskController.ts",
    code: "res.status(201).json({ data: task })",
    receives: "The saved task returned by the repository.",
    sends: "JSON back to the frontend."
  },
  {
    number: "10",
    label: "React update",
    concept: "State setter + re-render",
    file: "src/client/src/App.tsx",
    code: "setTasks(...); setApiHistory(...);",
    receives: "The JSON response and latest task list.",
    sends: "New state into React, which re-renders the visible UI."
  }
];

const supportConnections = [
  {
    title: "Types",
    file: "src/types/task.ts",
    connection: "Shared idea of what a Task looks like. Types guide functions, payloads, and repository results."
  },
  {
    title: "Imports / exports",
    file: "Many files",
    connection: "Exports make functions available. Imports connect files without placing all code in one giant file."
  },
  {
    title: "Error handler",
    file: "src/app.ts",
    connection: "If a controller calls next(error), Express skips normal response logic and sends an error response."
  }
];

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
        <h2>Numbered Learning Path</h2>
        <p>
          Study this project in this order. Each step gives you a goal, the files to open, what to learn, and a small example to connect
          the code to the running app.
        </p>
        <div className="path-list">
          {learningPath.map((item) => (
            <article className="path-card" key={item.step}>
              <div className="path-number">{item.step}</div>
              <div>
                <h3>{item.title}</h3>
                <strong>{item.goal}</strong>
                <p>{item.learn}</p>
                <div className="path-files" aria-label={`${item.title} files`}>
                  {item.files.map((file) => (
                    <code key={file}>{file}</code>
                  ))}
                </div>
                <small>{item.example}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-panel">
        <h2>Full Create Request Flow</h2>
        <pre>{requestFlow}</pre>
      </section>

      <section className="learning-panel">
        <h2>Code Pieces Connection Diagram</h2>
        <p>
          This map follows one create-task request and shows which coding idea appears at each step. Read each card as:
          this piece receives something, does one job, then sends something to the next piece.
        </p>
        <div className="code-map" aria-label="Code pieces connection diagram">
          {codeConnectionFlow.map((node, index) => (
            <article className="code-map-node" key={node.number}>
              <div className="code-map-topline">
                <span>{node.number}</span>
                <strong>{node.label}</strong>
              </div>
              <h3>{node.concept}</h3>
              <code>{node.file}</code>
              <pre><code>{node.code}</code></pre>
              <p><strong>Receives:</strong> {node.receives}</p>
              <p><strong>Sends:</strong> {node.sends}</p>
              {index < codeConnectionFlow.length - 1 && <div className="code-map-arrow" aria-hidden="true">Next</div>}
            </article>
          ))}
        </div>
        <div className="support-map" aria-label="Supporting code concepts">
          {supportConnections.map((item) => (
            <article className="support-card" key={item.title}>
              <h3>{item.title}</h3>
              <code>{item.file}</code>
              <p>{item.connection}</p>
            </article>
          ))}
        </div>
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
        <h2>Numbered File-By-File Reading Plan</h2>
        <div className="file-list">
          {fileWalkthrough.map((file) => (
            <article className="file-card" key={file.path}>
              <div className="file-card-header">
                <span>{file.order}</span>
                <code>{file.path}</code>
              </div>
              <p>{file.purpose}</p>
              <small><strong>Talks to:</strong> {file.talksTo}</small>
              <small><strong>Read for:</strong> {file.readFor}</small>
              <small><strong>Practice:</strong> {file.exercise}</small>
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
