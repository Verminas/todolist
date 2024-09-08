import axios from "axios";
import { apiKey } from "./apiKey";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": apiKey,
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
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title }).then((data) => data.data);
  },
  getTasks(todoID: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todoID}/tasks`).then((data) => data.data);
  },

  createTask(todoID: string, title: string) {
    return instance.post<ResponseType<TaskGeneric>>(`todo-lists/${todoID}/tasks`, { title }).then((data) => data.data);
  },

  updateTask(todoID: string, taskID: string, task: TaskUpdateModelType) {
    return instance
      .put<ResponseType<TaskGeneric>>(`todo-lists/${todoID}/tasks/${taskID}`, task)
      .then((data) => data.data);
  },

  removeTask(todoID: string, taskID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todoID}/tasks/${taskID}`).then((data) => data.data);
  },
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
