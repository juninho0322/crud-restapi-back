import app from "./app.js";
// process.env.PORT lets hosting platforms choose the port.
// If no PORT exists, the local study default is 3000.
const PORT = process.env.PORT || 3000;
// app.listen starts the HTTP server.
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
        console.error("Close the other server, or run this app on another port with: PORT=3001 npm run dev");
        process.exit(1);
    }
    throw error;
});
