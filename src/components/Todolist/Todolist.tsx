import React, {ChangeEvent} from 'react';
import Button from '@mui/material/Button';
import {useAutoAnimate} from "@formkit/auto-animate/react";
import styled from "styled-components";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {filterButtonsContainerSx, getListItemSx} from "./Todolist.styles";

export type FilterValueType = 'all' | 'active' | 'completed';

export type TaskPropsType = {
  id: string
  title: string
  isDone: boolean
}

type TodolistPropsType = {
  id: string
  title: string
  tasks: Array<TaskPropsType>

  changeTitleTodolist: (value: string, todoId: string) => void
  changeTitleTask: (value: string, taskId: string, todoId: string) => void
  changeFilter: (value: FilterValueType, todoId: string) => void
  removeTask: (id: string, todoId: string) => void
  removeTodolist: (todoId: string) => void
  changeTaskStatus: (checked: boolean, taskId: string, todoId: string) => void
  addTask: (value: string, todoId: string) => void
  filter: FilterValueType
}

export const Todolist = ({
                           id,
                           title,
                           tasks,
                           changeFilter,
                           removeTask,
                           removeTodolist,
                           changeTaskStatus,
                           changeTitleTodolist,
                           changeTitleTask,
                           addTask,
                           filter
                         }:
                           TodolistPropsType
  ) => {

    // animation for list tasks
    const [listRef] = useAutoAnimate<HTMLUListElement>()

    const addTaskHandler = (value: string) => {
      addTask(value, id)
    }

    const changeFilterHandler = (value: FilterValueType) => {
      changeFilter(value, id);
    }

    const changeTitleTodolistHandler = (value: string) => {
      changeTitleTodolist(value, id)
    }

    const removeTodolistHandler = () => {
      removeTodolist(id);
    }

    const tasksElements = tasks.map((t) => {
      const removeTaskHandler = () => {
        removeTask(t.id, id)
      }
      const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(e.currentTarget.checked, t.id, id);
      }
      const changeTitleTaskHandler = (value: string) => {
        changeTitleTask(value, t.id, id)
      }

      return (
        <ListItem key={t.id} disablePadding disableGutters sx={getListItemSx(t.isDone)}>
          <div>
            <Checkbox checked={t.isDone} onChange={changeTaskStatusHandler} color={t.isDone ? 'secondary' : 'primary'}/>
            <EditableSpan title={t.title} changeTitle={changeTitleTaskHandler} textFieldLabel={'Task title'}/>
          </div>
          <IconButton aria-label="delete task" onClick={removeTaskHandler} size={'small'}>
            <DeleteIcon/>
          </IconButton>
        </ListItem>
      )
    })

    return (
      <div>
        <WrapperTitle>
          <h3><EditableSpan title={title} changeTitle={changeTitleTodolistHandler} textFieldLabel={'Todolist title'}/>
          </h3>
          <IconButton aria-label="delete todolist" onClick={removeTodolistHandler} size={'small'}>
            <DeleteIcon/>
          </IconButton>
        </WrapperTitle>
        <AddItemForm addItem={addTaskHandler} textFieldLabel={'New task'} placeholder={'Add a new task...'}/>
        {tasks.length === 0
          ? <span>There are not tasks</span>
          : <List ref={listRef}>
            {tasksElements}
          </List>
        }
        <Box sx={filterButtonsContainerSx}>
          <Button children={'All'} onClick={() => changeFilterHandler('all')}
                  variant={filter === 'all' ? 'outlined' : 'text'} color={'inherit'} size={'small'}/>
          <Button children={'Active'} onClick={() => changeFilterHandler('active')}
                  variant={filter === 'active' ? 'outlined' : 'text'} color={'primary'} size={'small'}/>
          <Button children={'Completed'} onClick={() => changeFilterHandler('completed')}
                  variant={filter === 'completed' ? 'outlined' : 'text'} color={'secondary'} size={'small'}/>
        </Box>
      </div>
    );
  }
;

const WrapperTitle = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`