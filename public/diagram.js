const popover = document.querySelector("#code-popover");
const popoverTitle = document.querySelector("#popover-title");
const popoverFile = document.querySelector("#popover-file");
const popoverRole = document.querySelector("#popover-role");
const popoverExplanation = document.querySelector("#popover-explanation");
const popoverCode = document.querySelector("#popover-code");
const nodes = document.querySelectorAll(".diagram-node");

const nodeLessons = {
  frontend: {
    title: "Frontend JS",
    file: "public/app.js",
    role: "asks",
    explanation: "This is browser code. It reacts to clicks/forms, builds a request, and calls the API with fetch().",
    code: `async function apiRequest(method, url, body) {
  const response = await fetch(url, options);
  return response.json();
}`
  },
  express: {
    title: "Express App",
    file: "src/app.js",
    role: "receives",
    explanation: "This creates the Express app, serves the frontend, reads JSON bodies, and mounts the task routes.",
    code: `app.use(express.json());
app.use(express.static(publicDirectory));
app.use("/api/tasks", taskRoutes);`
  },
  routes: {
    title: "Routes",
    file: "src/routes/taskRoutes.js",
    role: "points",
    explanation: "Routes match HTTP method + URL and point the request to the correct controller function.",
    code: `router.get("/", listTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);`
  },
  controllers: {
    title: "Controllers",
    file: "src/controllers/taskController.js",
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
    file: "src/validators/taskValidator.js",
    role: "protects",
    explanation: "Validators stop bad input before it reaches storage. Backend validation matters because users can call APIs without your frontend.",
    code: `export function validateCreateTask(payload) {
  if (isMissingText(payload.title)) {
    return "Title is required";
  }
  return null;
}`
  },
  repositories: {
    title: "Repository",
    file: "src/repositories/taskRepository.js",
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

function showLesson(key) {
  const lesson = nodeLessons[key];

  popoverTitle.textContent = lesson.title;
  popoverFile.textContent = lesson.file;
  popoverRole.textContent = lesson.role;
  popoverExplanation.textContent = lesson.explanation;
  popoverCode.textContent = lesson.code;
  popover.classList.add("visible");
}

nodes.forEach((node) => {
  node.addEventListener("mouseenter", () => showLesson(node.dataset.node));
  node.addEventListener("focus", () => showLesson(node.dataset.node));
});

showLesson("frontend");
