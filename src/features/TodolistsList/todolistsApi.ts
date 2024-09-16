import { instance } from "common/api";
import {
  BaseResponse,
  RemoveTaskArgType,
  TaskResponseType,
  TaskUpdateModelType,
  TodoListTypeDomain,
  UpdateTodolistArgType,
} from "common/types";

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodoListTypeDomain[]>(`todo-lists/`).then((data) => data.data);
  },
  removeTodolist(todolistId: string) {
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}`).then((data) => data.data);
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<TodolistGeneric>>(`todo-lists/`, { title }).then((data) => data.data);
  },
  updateTodolist(arg: UpdateTodolistArgType) {
    const { title, todoId } = arg;
    return instance.put<BaseResponse>(`todo-lists/${todoId}`, { title }).then((data) => data.data);
  },
  getTasks(todoID: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todoID}/tasks`).then((data) => data.data);
  },

  createTask(arg: UpdateTodolistArgType) {
    const { todoId, title } = arg;
    return instance.post<BaseResponse<TaskGeneric>>(`todo-lists/${todoId}/tasks`, { title }).then((data) => data.data);
  },

  updateTask(arg: UpdateTaskArgType) {
    const { taskId, task, todoId } = arg;
    return instance
      .put<BaseResponse<TaskGeneric>>(`todo-lists/${todoId}/tasks/${taskId}`, task)
      .then((data) => data.data);
  },

  removeTask(arg: RemoveTaskArgType) {
    const { taskId, todoId } = arg;
    return instance.delete<BaseResponse>(`todo-lists/${todoId}/tasks/${taskId}`).then((data) => data.data);
  },
};

type UpdateTaskArgType = {
  todoId: string;
  taskId: string;
  task: TaskUpdateModelType;
};

type TodolistGeneric = {
  item: TodoListTypeDomain;
};

type GetTasksResponseType = {
  error: null | string;
  items: TaskResponseType[];
  totalCount: number;
};

type TaskGeneric = {
  item: TaskResponseType;
};
