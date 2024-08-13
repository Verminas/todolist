// @flow
import * as React from 'react';
import {getListItemSx} from "../Todolist/Todolist.styles";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import {ChangeEvent, memo, useCallback} from "react";
import {RequestStatusType} from "../../app/app-reducer";

type Props = {
  id: string
  todoId: string
  isDone: boolean
  title: string
  updateTask: (todoId: string, taskId: string, title: string, isDone: boolean) => void
  removeTask: (id: string, todoId: string) => void
  entityStatus: RequestStatusType
};
export const TaskItem = memo(({ id, title, isDone, removeTask, todoId, updateTask, entityStatus}: Props) => {
  const taskIsLoading = entityStatus === 'loading';

  const removeTaskHandler = () => {
    removeTask(id, todoId)
  }
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    updateTask(todoId, id, title, e.currentTarget.checked);
  }
  const changeTaskTitleHandler = useCallback((value: string) => {
    updateTask(todoId, id, value, isDone)
  }, [updateTask, id, todoId])


  return (
    <ListItem key={id} disablePadding disableGutters sx={getListItemSx(isDone)}>
      <div>
        <Checkbox checked={isDone} onChange={changeTaskStatusHandler} color={isDone ? 'secondary' : 'primary'} disabled={taskIsLoading}/>
        <EditableSpan title={title} changeTitle={changeTaskTitleHandler} textFieldLabel={'Task title'} disabled={taskIsLoading}/>
      </div>
      <IconButton aria-label="delete task" onClick={removeTaskHandler} size={'small'} disabled={taskIsLoading}>
        <DeleteIcon/>
      </IconButton>
    </ListItem>
  );
});