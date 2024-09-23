import { instance } from "common/instance";
import {
  BaseResponse,
  RemoveTaskArgType,
  TaskResponseType,
  TaskUpdateModelType,
  UpdateTodolistArgType,
} from "common/types";

export const tasksApi = {
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

type GetTasksResponseType = {
  error: null | string;
  items: TaskResponseType[];
  totalCount: number;
};
type TaskGeneric = {
  item: TaskResponseType;
};
type UpdateTaskArgType = {
  todoId: string;
  taskId: string;
  task: TaskUpdateModelType;
};
