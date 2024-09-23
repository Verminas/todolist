import { instance } from "common/instance";
import { BaseResponse, TodoListTypeDomain, UpdateTodolistArgType } from "common/types";

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
};

type TodolistGeneric = {
  item: TodoListTypeDomain;
};
