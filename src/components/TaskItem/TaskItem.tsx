// @flow
import * as React from 'react';
import {getListItemSx} from "../Todolist/Todolist.styles";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import {ChangeEvent, memo, useCallback} from "react";

type Props = {
  id: string
  todoId: string
  isDone: boolean
  title: string
  changeStatus: (checked: boolean, taskId: string, todoId: string) => void
  changeTitle: (value: string, taskId: string, todoId: string) => void
  removeTask: (id: string, todoId: string) => void
};
export const TaskItem = memo(({ id, title, isDone, changeStatus, removeTask, changeTitle, todoId}: Props) => {
  console.log('task item', title)
  const removeTaskHandler = () => {
    removeTask(id, todoId)
  }
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    changeStatus(e.currentTarget.checked, id, todoId);
  }
  const changeTaskTitleHandler = useCallback((value: string) => {
    changeTitle(value, id, todoId);
  }, [changeTitle, id, todoId])

  return (
    <ListItem key={id} disablePadding disableGutters sx={getListItemSx(isDone)}>
      <div>
        <Checkbox checked={isDone} onChange={changeTaskStatusHandler} color={isDone ? 'secondary' : 'primary'}/>
        <EditableSpan title={title} changeTitle={changeTaskTitleHandler} textFieldLabel={'Task title'}/>
      </div>
      <IconButton aria-label="delete task" onClick={removeTaskHandler} size={'small'}>
        <DeleteIcon/>
      </IconButton>
    </ListItem>
  );
});