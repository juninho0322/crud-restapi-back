// Vercel entry point.
// Locally, src/server.ts starts the API with app.listen().
// On Vercel, this file exports the Express app as a serverless function.
import app from "../src/app.js";

export default app;
