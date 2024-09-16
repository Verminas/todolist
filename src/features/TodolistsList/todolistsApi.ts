import { instance } from "common/api";

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodoListTypeDomain[]>(`todo-lists/`).then((data) => data.data);
  },
  removeTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`).then((data) => data.data);
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<TodolistGeneric>>(`todo-lists/`, { title }).then((data) => data.data);
  },
  updateTodolist(arg: UpdateTodolistArgType) {
    const { title, todoId } = arg;
    return instance.put<ResponseType>(`todo-lists/${todoId}`, { title }).then((data) => data.data);
  },
  getTasks(todoID: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todoID}/tasks`).then((data) => data.data);
  },

  createTask(arg: UpdateTodolistArgType) {
    const { todoId, title } = arg;
    return instance.post<ResponseType<TaskGeneric>>(`todo-lists/${todoId}/tasks`, { title }).then((data) => data.data);
  },

  updateTask(arg: UpdateTaskArgType) {
    const { taskId, task, todoId } = arg;
    return instance
      .put<ResponseType<TaskGeneric>>(`todo-lists/${todoId}/tasks/${taskId}`, task)
      .then((data) => data.data);
  },

  removeTask(arg: RemoveTaskArgType) {
    const { taskId, todoId } = arg;
    return instance.delete<ResponseType>(`todo-lists/${todoId}/tasks/${taskId}`).then((data) => data.data);
  },
};

export type UpdateTodolistArgType = {
  todoId: string;
  title: string;
};

type UpdateTaskArgType = {
  todoId: string;
  taskId: string;
  task: TaskUpdateModelType;
};

export type RemoveTaskArgType = {
  todoId: string;
  taskId: string;
};

export type TodoListTypeDomain = {
  addedDate: string;
  id: string;
  order: number;
  title: string;
};

type TodolistGeneric = {
  item: TodoListTypeDomain;
};

type FieldErrorType = {
  error: string;
  field: string;
};

export type ResponseType<D = {}> = {
  data: D;
  fieldsErrors: FieldErrorType[];
  messages: string[];
  resultCode: number;
};

type GetTasksResponseType = {
  error: null | string;
  items: TaskResponseType[];
  totalCount: number;
};

type TaskGeneric = {
  item: TaskResponseType;
};

export type TaskResponseType = {
  description: string | null;
  title: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: string | null;
  deadline: string | null;

  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

export type TaskUpdateModelType = {
  title: string;
  description: string | null;
  completed: boolean;
  status: number;
  priority: number;
  startDate: string | null;
  deadline: string | null;
};
