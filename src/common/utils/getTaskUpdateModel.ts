import { TaskPropsType } from "features/TodolistsList/tasksSlice";
import { TaskStatuses } from "common/enums";
import { TaskUpdateModelType } from "common/types";

export const getTaskUpdateModel = (task: TaskPropsType): TaskUpdateModelType => ({
  description: task.description,
  completed: task.completed,
  deadline: task.deadline,
  priority: task.priority,
  startDate: task.startDate,
  title: task.title,
  status: task.isDone ? TaskStatuses.inProgress : TaskStatuses.New,
});
