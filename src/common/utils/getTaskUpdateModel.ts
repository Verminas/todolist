import { TaskPropsType } from "features/TodolistsList/model/tasks/tasksSlice";
import { TaskStatuses } from "common/enums";
import { TaskUpdateModelType } from "common/types";

/**
 * Function to create a TaskUpdateModel for API based on a TaskPropsType object.
 *
 * @param {TaskPropsType} task - The task object containing properties to create the TaskUpdateModel from.
 *
 * @returns {TaskUpdateModelType} - The TaskUpdateModel created from the TaskPropsType object.
 */

export const getTaskUpdateModel = (task: TaskPropsType): TaskUpdateModelType => ({
  description: task.description,
  completed: task.completed,
  deadline: task.deadline,
  priority: task.priority,
  startDate: task.startDate,
  title: task.title,
  status: task.isDone ? TaskStatuses.inProgress : TaskStatuses.New,
});
