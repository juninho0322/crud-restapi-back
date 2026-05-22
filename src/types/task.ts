export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
};

export type UpdateTaskPayload = {
  title: string;
  description?: string;
  completed: boolean;
};

export type TaskFilters = {
  completed?: string;
  search?: string;
};

export type StorageMode = "postgres" | "memory-temporary" | "json-file-local";
