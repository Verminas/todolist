// @flow
import * as React from "react";
import { getListItemSx } from "./Task.styles";
import Checkbox from "@mui/material/Checkbox";
import { EditableSpan } from "common/components";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import { ChangeEvent, memo, useCallback } from "react";
import { TaskPropsType } from "../../tasksSlice";

import { RemoveTaskArgType } from "common/types";

type Props = {
  task: TaskPropsType;
  todolistIsLoading: boolean;

  updateTask: (task: TaskPropsType) => void;
  removeTask: (arg: RemoveTaskArgType) => void;
};
export const Task = memo(
  ({
    removeTask,
    updateTask,
    task,
    task: { id, todoListId, isDone, title, entityStatus },
    todolistIsLoading,
  }: Props) => {
    const taskIsLoading = todolistIsLoading || entityStatus === "loading";

    const removeTaskHandler = () => {
      removeTask({ todoId: todoListId, taskId: id });
    };
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      // updateTask(todoListId, id, title, e.currentTarget.checked);
      updateTask({ ...task, isDone: e.currentTarget.checked });
    };
    const changeTaskTitleHandler = useCallback(
      (value: string) => {
        // updateTask(todoListId, id, value, isDone);
        updateTask({ ...task, title: value });
      },
      [updateTask, task, isDone],
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
            changeTitle={changeTaskTitleHandler}
            textFieldLabel={"Task title"}
            disabled={taskIsLoading}
          />
        </div>
        <IconButton aria-label="delete task" onClick={removeTaskHandler} size={"small"} disabled={taskIsLoading}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  },
);
