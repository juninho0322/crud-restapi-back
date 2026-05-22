import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { getStorageStatus } from "./repositories/taskRepository.js";
import taskRoutes from "./routes/taskRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.resolve(__dirname, "../public");

// The app is the center of the API.
// It connects global middleware, top-level routes, and final error handlers.
const app = express();

// cors() allows browsers from other origins to call this API.
// Example: a React app on localhost:5173 can call this server on localhost:3000.
app.use(cors());

// express.json() reads JSON request bodies and puts the parsed object in req.body.
// Without this, POST and PUT requests would not understand JSON payloads.
app.use(express.json());

// morgan("dev") logs every HTTP request in the terminal while you study/debug.
app.use(morgan("dev"));

// express.static serves frontend files from the public folder.
// When the browser asks for /, Express sends public/index.html.
// When it asks for /styles.css or /app.js, Express sends those files too.
app.use(express.static(publicDirectory));

// A health route is a tiny endpoint used to check whether the server is alive.
app.get("/health", async (req, res, next) => {
  try {
    const storage = await getStorageStatus();

    return res.json({
      status: "ok",
      message: "CRUD Study API is running",
      storage: storage.mode,
      storageNote: storage.note
    });
  } catch (error) {
    return next(error);
  }
});

// Any request that starts with /api/tasks is sent to taskRoutes.
// Example: GET /api/tasks will enter src/routes/taskRoutes.js.
app.use("/api/tasks", taskRoutes);

// If no route matched above, this creates a clean 404 response.
app.use(notFoundHandler);

// If any route calls next(error), Express sends the error here.
app.use(errorHandler);

export default app;
