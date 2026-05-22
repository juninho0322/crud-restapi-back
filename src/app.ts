import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { getStorageStatus } from "./repositories/taskRepository.js";
import taskRoutes from "./routes/taskRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildDirectory = path.resolve(process.cwd(), "dist/client");

// The app is the center of the API.
// It connects global middleware, frontend static files, API routes, and error handlers.
const app = express();

// cors() allows browsers from other origins to call this API.
app.use(cors());

// express.json() reads JSON request bodies and puts the parsed object in req.body.
app.use(express.json());

// morgan("dev") logs every HTTP request in the terminal while you study/debug.
app.use(morgan("dev"));

// In the TypeScript/React version, Vite builds the frontend into dist/client.
app.use(express.static(clientBuildDirectory));

// A health route checks whether the server is alive and which storage mode is active.
app.get("/health", async (req: Request, res: Response, next: NextFunction) => {
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

// Browsers often request /favicon.ico automatically. Returning 204 avoids a noisy study-time 404.
app.get("/favicon.ico", (req: Request, res: Response) => {
  res.status(204).end();
});

// Any request that starts with /api/tasks is sent to taskRoutes.
app.use("/api/tasks", taskRoutes);

// React client routes should return the built index.html.
app.get(["/", "/diagram.html", "/breakdown"], (req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildDirectory, "index.html"));
});

// If no route matched above, this creates a clean 404 response.
app.use(notFoundHandler);

// If any route calls next(error), Express sends the error here.
app.use(errorHandler);

export default app;
