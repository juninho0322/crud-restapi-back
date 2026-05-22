# Deploy To Vercel

This project can deploy to Vercel.

Locally, it uses:

```text
public/app.js -> Express API -> data/tasks.json
```

On Vercel, use:

```text
public/app.js -> Vercel Function -> Express API -> Postgres database
```

## Why The Storage Changes

`data/tasks.json` is perfect for local study because you can open the file and see the data.

Vercel deployments are serverless. You should not rely on writing to project files after deployment. For real deployed CRUD, use a database.

This project now supports both:

```text
No DATABASE_URL locally:
  use data/tasks.json

DATABASE_URL or POSTGRES_URL exists:
  use Postgres

On Vercel with no database URL:
  use temporary memory storage
```

Temporary memory storage lets the app run, but data can disappear when the serverless function restarts. Use Postgres for real saved data.

## Files Added For Vercel

```text
api/index.js
  Vercel serverless function entry point

vercel.json
  Sends requests into the Express app

.env.example
  Shows the database environment variable shape
```

## Deploy Steps

1. Push this project to GitHub.
2. Create a new Vercel project from the GitHub repo.
3. Add a Postgres database.
4. Add one of these environment variables in Vercel:

```text
DATABASE_URL
```

or:

```text
POSTGRES_URL
```

5. Deploy.

## What Talks To What On Vercel

```text
Browser
  -> public/app.js
  -> fetch("/api/tasks")
  -> api/index.js
  -> src/app.js
  -> src/routes/taskRoutes.js
  -> src/controllers/taskController.js
  -> src/repositories/taskRepository.js
  -> Postgres
```

## If You See "Internal server error"

Open this URL on your deployed app:

```text
https://YOUR-PROJECT.vercel.app/health
```

Check the `storage` value:

```json
{
  "storage": "postgres"
}
```

means it is using your database.

```json
{
  "storage": "memory-temporary"
}
```

means no working database connection is available yet, so the app is using temporary storage.

If you want permanent saved tasks, add a Postgres database in Vercel and make sure `DATABASE_URL` or `POSTGRES_URL` exists in the project environment variables.

For Vercel serverless deployments, prefer the Supabase **connection pooler** string instead of the direct database string.

It usually looks like this:

```text
postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

In Supabase, find it under:

```text
Project Settings -> Database -> Connection string -> Transaction pooler
```

Paste that full value into Vercel as `DATABASE_URL`, save it for Production, and redeploy.

## Important Learning Point

The controller did not need to change when storage changed.

That is why the repository layer exists:

```text
controller asks for tasks
repository decides where tasks come from
```

Today the repository can choose JSON, temporary memory, or Postgres.
