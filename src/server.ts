import app from "./app.js";

// process.env.PORT lets hosting platforms choose the port.
// If no PORT exists, the local study default is 3000.
const PORT = process.env.PORT || 3000;

// app.listen starts the HTTP server.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
