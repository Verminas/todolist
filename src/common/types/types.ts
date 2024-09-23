import { FilterValueType } from "features/TodolistsList/todolistsSlice";

export type ChangeTodolistFilterType = {
  filter: FilterValueType;
  todoId: string;
};
type FieldErrorType = {
  error: string;
  field: string;
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
export type CreateTaskReturnArgType = {
  task: TaskResponseType;
};
export type RemoveTodolistArgType = {
  todoId: string;
};
export type FetchTasksArgType = {
  todoId: string;
  tasks: Array<TaskResponseType>;
};
export type TodoListTypeDomain = {
  addedDate: string;
  id: string;
  order: number;
  title: string;
};
export type BaseResponse<D = {}> = {
  data: D;
  fieldsErrors: FieldErrorType[];
  messages: string[];
  resultCode: number;
};
export type TodolistsObjType = {
  todolists: TodoListTypeDomain[];
};
export type TodolistObjType = {
  todolist: TodoListTypeDomain;
};
export type UpdateTodolistArgType = {
  todoId: string;
  title: string;
};
export type RemoveTaskArgType = {
  todoId: string;
  taskId: string;
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
