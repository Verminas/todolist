// @flow
import * as React from "react";
import { getListItemSx } from "features/TodolistsList/ui/Todolist/TasksList/Task/Task.styles";
import Checkbox from "@mui/material/Checkbox";
import { EditableSpan } from "common/components";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import { ChangeEvent, memo, useCallback } from "react";
import { TaskPropsType } from "features/TodolistsList/model/tasks/tasksSlice";

import { useActions } from "common/hooks";

type Props = {
  task: TaskPropsType;
  todolistIsLoading: boolean;
};
export const Task = memo(({ task, todolistIsLoading }: Props) => {
  const { id, todoListId, isDone, title, entityStatus } = task;
  const { removeTask, updateTask } = useActions();
  const taskIsLoading = todolistIsLoading || entityStatus === "loading";

  const removeTaskHandler = () => {
    removeTask({ todoId: todoListId, taskId: id });
  };
  const changeTaskStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTask({ ...task, isDone: e.currentTarget.checked });
    },
    [updateTask, task],
  );
  const changeTaskTitle = useCallback(
    (title: string) => {
      updateTask({ ...task, title });
    },
    [updateTask, task],
  );

  console.log("title of task", title);

  return (
    <ListItem key={id} disablePadding disableGutters sx={getListItemSx(isDone)}>
      <div>
        <Checkbox
          checked={isDone}
          onChange={changeTaskStatusHandler}
          color={isDone ? "secondary" : "primary"}
          disabled={taskIsLoading}
        />
        <EditableSpan
          title={title}
          changeTitle={changeTaskTitle}
          textFieldLabel={"Task title"}
          disabled={taskIsLoading}
        />
      </div>
      <IconButton aria-label="delete task" onClick={removeTaskHandler} size={"small"} disabled={taskIsLoading}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
});
