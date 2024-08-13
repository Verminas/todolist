// @flow
import * as React from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../state/store";
import {
  changeFilterAC,
  changeTitleTodolistTC,
  FilterValueType,
  removeTodolistTC,
  TodolistType
} from "../../state/reducers/todolistsReducer";
import {createTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from "../../state/reducers/tasksReducer";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import {Todolist} from "../Todolist/Todolist";
import {useCallback} from "react";

type Props = {

};
export const TodolistsList = (props: Props) => {
  const todoLists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useAppDispatch();

  const removeTask = useCallback((id: string, todoId: string) => {
    dispatch(removeTaskTC(todoId, id))
  }, []) // + tests

  const removeTodolist = useCallback((todoId: string) => {
    dispatch(removeTodolistTC(todoId))
  }, []) // + tests

  const changeFilter = useCallback((filter: FilterValueType, todoId: string) => {
    dispatch(changeFilterAC(todoId, filter))
  }, []) // + tests


  const updateTask = useCallback((todoId: string, taskId: string, title: string, isDone: boolean) => {
    dispatch(updateTaskTC(todoId, taskId, title, isDone))
  }, [])

  const addTask = useCallback((title: string, todoId: string) => {
    dispatch(createTaskTC(todoId, title))
  }, []) // + tests

  const changeTitleTodolist = useCallback((title: string, todoId: string) => {
    dispatch(changeTitleTodolistTC(todoId, title))
  }, []) // + tests

  const todoListsElements = todoLists.length === 0
    ? <span>There are no todolists</span>
    : todoLists.map(tl => {

      return (
        <Grid key={tl.id}>
          <Paper elevation={3} sx={{p: '0 20px 20px 20px'}}>
            <Todolist
              id={tl.id}
              filter={tl.filter}
              title={tl.title}
              tasks={tasks[tl.id]}
              entityStatus={tl.entityStatus}

              changeFilter={changeFilter}
              removeTask={removeTask}
              removeTodolist={removeTodolist}
              addTask={addTask}
              changeTitleTodolist={changeTitleTodolist}
              updateTask={updateTask}
            />
          </Paper>
        </Grid>
      )
    })

  return (
    <>
      { todoListsElements }
    </>
  );
};