import { FilterValueType } from "features/TodolistsList/todolistsSlice";
import { TaskResponseType, TodoListTypeDomain } from "features/TodolistsList/todolistsApi";

export type ChangeTodolistFilterType = {
  filter: FilterValueType;
  todoId: string;
};
export type CreateTaskReturnArgType = {
  todoId: string;
  task: TaskResponseType;
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
