import React, {ChangeEvent, memo, useCallback} from 'react';
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
import {TaskItem} from "../TaskItem/TaskItem";
import {useSelector} from "react-redux";

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

export const Todolist = memo(({
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
  console.log('todolist called', title)

  // animation for list tasks
  const [listRef] = useAutoAnimate<HTMLUListElement>()

  const addTaskHandler = useCallback((value: string) => {
    addTask(value, id)
  }, [addTask, id])

  const removeTaskHandler = useCallback((taskId: string) => {
    removeTask(taskId, id )
  }, [removeTask, id])

  const changeTitleTaskHandler = useCallback((taskId: string, title: string) => {
    changeTitleTask(title, taskId, id)
  }, [changeTitleTask, id])

  const changeStatusTaskHandler = useCallback((taskId: string, checked: boolean) => {
    changeTaskStatus(checked, taskId, id)
  }, [changeTaskStatus, id])

  const onAllClickChangeFilterHandler = useCallback(() => {
    changeFilter('all', id);
  }, [changeFilter, id])
  const onActiveClickChangeFilterHandler = useCallback(() => {
    changeFilter('active', id);
  }, [changeFilter, id])
  const onCompletedClickChangeFilterHandler = useCallback(() => {
    changeFilter('completed', id);
  }, [changeFilter, id])

  const changeTitleTodolistHandler = useCallback((value: string) => {
    changeTitleTodolist(value, id)
  }, [changeTitleTodolist, id])

  const removeTodolistHandler = () => {
    removeTodolist(id);
  }


  let filteredTasks = tasks;

  if (filter === 'active') {
    filteredTasks = filteredTasks.filter((t) => !t.isDone);
  }
  if (filter === 'completed') {
    filteredTasks = filteredTasks.filter((t) => t.isDone);
  }

  const tasksElements = filteredTasks.map((t) => {
    return <TaskItem id={t.id}
                     key={t.id}
                     title={t.title}
                     isDone={t.isDone}
                     removeTask={removeTaskHandler}
                     changeTitle={changeTitleTaskHandler}
                     changeStatus={changeStatusTaskHandler}
    />
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
        <Button children={'All'} onClick={onAllClickChangeFilterHandler}
                variant={filter === 'all' ? 'outlined' : 'text'} color={'inherit'} size={'small'}/>
        <Button children={'Active'} onClick={onActiveClickChangeFilterHandler}
                variant={filter === 'active' ? 'outlined' : 'text'} color={'primary'} size={'small'}/>
        <Button children={'Completed'} onClick={onCompletedClickChangeFilterHandler}
                variant={filter === 'completed' ? 'outlined' : 'text'} color={'secondary'} size={'small'}/>
      </Box>
    </div>
  );
});

const WrapperTitle = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`