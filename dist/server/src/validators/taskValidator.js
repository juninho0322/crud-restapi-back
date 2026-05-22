// Validators protect the application from bad input.
// A validator returns a message when data is invalid, or null when data is valid.
function isMissingText(value) {
    return typeof value !== "string" || value.trim().length === 0;
}
// POST /api/tasks only needs a title.
// description is optional, and completed is created automatically as false.
export function validateCreateTask(payload) {
    if (isMissingText(payload.title)) {
        return "Title is required";
    }
    if (payload.description !== undefined && typeof payload.description !== "string") {
        return "Description must be a string";
    }
    return null;
}
// PUT /api/tasks/:id updates the full task.
// This project requires title and completed so you can practice full updates.
export function validateUpdateTask(payload) {
    if (isMissingText(payload.title)) {
        return "Title is required";
    }
    if (payload.description !== undefined && typeof payload.description !== "string") {
        return "Description must be a string";
    }
    if (typeof payload.completed !== "boolean") {
        return "Completed must be true or false";
    }
    return null;
}
