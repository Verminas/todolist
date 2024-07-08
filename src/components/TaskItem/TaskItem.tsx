// @flow
import * as React from 'react';
import {getListItemSx} from "../Todolist/Todolist.styles";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import {ChangeEvent} from "react";

type Props = {
  id: string
  isDone: boolean
  title: string
  checkboxOnChange: (e: ChangeEvent<HTMLInputElement>) => void
  spanOnChange: (value: string) => void
  onClick: () => void

};
export const TaskItem = ({checkboxOnChange, spanOnChange, id, title, isDone, onClick}: Props) => {
  return (
    <ListItem key={id} disablePadding disableGutters sx={getListItemSx(isDone)}>
      <div>
        <Checkbox checked={isDone} onChange={checkboxOnChange} color={isDone ? 'secondary' : 'primary'}/>
        <EditableSpan title={title} changeTitle={spanOnChange} textFieldLabel={'Task title'}/>
      </div>
      <IconButton aria-label="delete task" onClick={onClick} size={'small'}>
        <DeleteIcon/>
      </IconButton>
    </ListItem>
  );
};