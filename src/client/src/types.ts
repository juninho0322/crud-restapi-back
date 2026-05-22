export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FilterValue = "all" | "true" | "false";

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ApiHistoryItem = {
  id: number;
  label: string;
  method: ApiMethod;
  url: string;
  body: unknown;
  time: string;
};

export type LessonKey = "list" | "create" | "update" | "delete";

export type DiagramNodeKey =
  | "frontend"
  | "express"
  | "routes"
  | "controllers"
  | "validators"
  | "repositories"
  | "local"
  | "deployed";
