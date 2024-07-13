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
  isDone: boolean
  title: string
  changeStatus: (id: string, checked: boolean) => void
  changeTitle: (id: string, value: string) => void
  removeTask: (id: string) => void

};
export const TaskItem = memo(({ id, title, isDone, changeStatus, removeTask, changeTitle}: Props) => {
  console.log('task item', title)
  const removeTaskHandler = () => {
    removeTask(id)
  }
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    changeStatus(id, e.currentTarget.checked);
  }
  const changeTaskTitleHandler = useCallback((value: string) => {
    changeTitle(id, value)
  }, [changeTitle, id])

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