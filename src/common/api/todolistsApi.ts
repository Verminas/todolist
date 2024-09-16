import axios from "axios";
import { FilterValueType } from "features/TodolistsList/todolistsSlice";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
  headers: {
    "API-KEY": process.env.REACT_APP_API_KEY,
  },
});

export const authAPI = {
  login(payload: LoginParamsType) {
    return instance.post<ResponseType<LoginGenericType>>("auth/login", payload).then((data) => data.data);
  },
  me() {
    return instance.get<ResponseType<AuthMeResponseGeneric>>("auth/me").then((data) => data.data);
  },
  logout() {
    return instance.delete<ResponseType>("auth/login").then((data) => data.data);
  },
};

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

export type ChangeTodolistFilterType = {
  filter: FilterValueType;
  todoId: string;
};

export type CreateTaskReturnArgType = {
  todoId: string;
  task: TaskResponseType;
};

export type UpdateTaskArgType = {
  todoId: string;
  taskId: string;
  task: TaskUpdateModelType;
};

export type RemoveTaskArgType = {
  todoId: string;
  taskId: string;
};

export type RemoveTodolistArgType = {
  todoId: string;
};

export type FetchTasksArgType = {
  todoId: string;
  tasks: Array<TaskResponseType>;
};

export type TodolistsObjType = {
  todolists: TodoListTypeDomain[];
};

export type TodolistObjType = {
  todolist: TodoListTypeDomain;
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: boolean;
};

type LoginGenericType = {
  userId: number;
};

type AuthMeResponseGeneric = {
  id: number;
  email: string;
  login: string;
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
