import type { ApiMethod, LessonKey } from "../types.js";

type StudyGuideProps = {
  currentLesson: {
    action: string;
    method: ApiMethod;
    codePath: string;
    lesson: string;
  };
  lessonKey: LessonKey;
  setLessonKey: (key: LessonKey) => void;
  state: {
    activeFilter: string;
    tasksInMemory: number;
    editingTaskId: string | null;
    visibleTasks: number;
  };
};

const endpointCards: Array<{ key: LessonKey; label: string; endpoint: string }> = [
  { key: "list", label: "Read all", endpoint: "GET /api/tasks" },
  { key: "create", label: "Create", endpoint: "POST /api/tasks" },
  { key: "update", label: "Update", endpoint: "PUT /api/tasks/:id" },
  { key: "delete", label: "Delete", endpoint: "DELETE /api/tasks/:id" }
];

export function StudyGuide({ currentLesson, lessonKey, setLessonKey, state }: StudyGuideProps) {
  return (
    <section id="study-guide" className="study-layout" aria-label="Frontend learning guide">
      <article className="study-panel wide">
        <div className="section-title">
          <div>
            <h2>What exactly is the API?</h2>
            <p>The API is the contract between your frontend and your backend.</p>
          </div>
        </div>
        <div className="api-explainer">
          <section>
            <h3>Frontend view</h3>
            <p>Your React code does not open the database. It calls URLs like <code>/api/tasks</code> with <code>fetch()</code>.</p>
          </section>
          <section>
            <h3>Backend view</h3>
            <p>Express receives those URLs, runs route/controller/repository code, and sends JSON back.</p>
          </section>
          <section>
            <h3>API contract</h3>
            <p>The contract says which method, URL, request body, status code, and response shape are allowed.</p>
          </section>
        </div>
        <pre>{`POST /api/tasks
Request body:
{
  "title": "Study APIs",
  "description": "Frontend asks, backend saves"
}

Response:
{
  "data": {
    "id": "generated-id",
    "title": "Study APIs",
    "completed": false
  }
}`}</pre>
      </article>

      <article id="study-plan" className="study-panel wide">
        <div className="section-title">
          <div>
            <h2>Study plan</h2>
            <p>Use this order when learning the project from frontend to backend.</p>
          </div>
        </div>
        <div className="phase-grid">
          {[
            ["Click the app", "Create, edit, complete, and delete a task. Watch the request panels change."],
            ["Start at React", "Read src/client/src/App.tsx. Find apiRequest(), saveTask(), and loadTasks()."],
            ["Enter Express", "Read src/app.ts. This file connects middleware, React files, and API routes."],
            ["Follow routes", "Read src/routes/taskRoutes.ts. Match each HTTP method to a controller."],
            ["Read controllers", "Read src/controllers/taskController.ts. Look for req, res, validation, and repository calls."],
            ["Finish at storage", "Read src/repositories/taskRepository.ts. This is where local JSON or Supabase is used."]
          ].map(([title, text], index) => (
            <section className="phase-card" key={title}>
              <span>{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </section>
          ))}
        </div>
      </article>

      <article className="study-panel wide">
        <div className="section-title">
          <div>
            <h2>Who talks to who</h2>
            <p>The dependency direction should always move downward.</p>
          </div>
        </div>
        <pre>{`src/client/src/App.tsx
  -> fetch("/api/tasks")
  -> src/app.ts
  -> src/routes/taskRoutes.ts
  -> src/controllers/taskController.ts
  -> src/validators/taskValidator.ts
  -> src/repositories/taskRepository.ts
  -> local data/tasks.json or Supabase Postgres`}</pre>
      </article>

      <article className="study-panel">
        <div className="section-title">
          <div>
            <h2>Current code path</h2>
            <p>{currentLesson.action}</p>
          </div>
        </div>
        <pre>{currentLesson.codePath}</pre>
      </article>

      <article className="study-panel">
        <div className="section-title">
          <div>
            <h2>Frontend state</h2>
            <p>This is what React remembers while the page is open.</p>
          </div>
        </div>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </article>

      <article className="study-panel">
        <div className="section-title">
          <div>
            <h2>Endpoint map</h2>
            <p>Each UI action calls one REST endpoint.</p>
          </div>
        </div>
        <div className="endpoint-list">
          {endpointCards.map((card) => (
            <button
              className={`endpoint-card${lessonKey === card.key ? " active" : ""}`}
              key={card.key}
              type="button"
              onClick={() => setLessonKey(card.key)}
            >
              <strong>{card.label}</strong>
              <span>{card.endpoint}</span>
            </button>
          ))}
        </div>
      </article>

      <article className="study-panel">
        <div className="section-title">
          <div>
            <h2>Selected endpoint lesson</h2>
            <p>Click an endpoint or use the app to update this lesson.</p>
          </div>
        </div>
        <pre>{currentLesson.lesson}</pre>
      </article>
    </section>
  );
}
