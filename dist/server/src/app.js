import cors from "cors";
import express from "express";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { getStorageStatus } from "./repositories/taskRepository.js";
import taskRoutes from "./routes/taskRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildDirectory = path.resolve(process.cwd(), "dist/client");
const clientAssetsDirectory = path.join(clientBuildDirectory, "assets");
function findCurrentBuiltAsset(extension) {
    if (!fs.existsSync(clientAssetsDirectory)) {
        return null;
    }
    return fs
        .readdirSync(clientAssetsDirectory)
        .find((fileName) => fileName.startsWith("index-") && fileName.endsWith(extension)) ?? null;
}
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
// Vite asset files are safe to cache, but the HTML should revalidate so it does not point to old hashed assets.
app.use(express.static(clientBuildDirectory, {
    setHeaders(res, filePath) {
        if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-store");
        }
    }
}));
// During study/development, a browser tab may still ask for an older Vite hash after a rebuild.
// This redirects stale /assets/index-*.js or .css requests to the current built asset instead of showing a noisy 404.
app.get("/assets/:assetName", (req, res, next) => {
    const requestedAsset = Array.isArray(req.params.assetName) ? req.params.assetName[0] : req.params.assetName;
    const extension = requestedAsset.endsWith(".js") ? ".js" : requestedAsset.endsWith(".css") ? ".css" : null;
    if (!requestedAsset.startsWith("index-") || extension === null) {
        return next();
    }
    const currentAsset = findCurrentBuiltAsset(extension);
    if (currentAsset === null) {
        return next();
    }
    return res.redirect(302, `/assets/${currentAsset}`);
});
// A health route checks whether the server is alive and which storage mode is active.
app.get("/health", async (req, res, next) => {
    try {
        const storage = await getStorageStatus();
        return res.json({
            status: "ok",
            message: "CRUD Study API is running",
            storage: storage.mode,
            storageNote: storage.note
        });
    }
    catch (error) {
        return next(error);
    }
});
// Browsers often request /favicon.ico automatically. Returning 204 avoids a noisy study-time 404.
app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});
// Any request that starts with /api/tasks is sent to taskRoutes.
app.use("/api/tasks", taskRoutes);
// React client routes should return the built index.html.
app.get(["/", "/diagram.html", "/breakdown"], (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.join(clientBuildDirectory, "index.html"));
});
// If no route matched above, this creates a clean 404 response.
app.use(notFoundHandler);
// If any route calls next(error), Express sends the error here.
app.use(errorHandler);
export default app;
