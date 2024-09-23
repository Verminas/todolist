// @flow
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { TaskPropsType } from "features/TodolistsList/tasksSlice";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Navigate } from "react-router-dom";
import { PATH } from "common/router/router";
import { selectIsLoggedIn } from "features/auth/authSlice";
import { selectTodolists } from "features/TodolistsList/todolistsSlice";
import { selectTasks } from "features/TodolistsList/tasksSlice";
import styled from "styled-components";
import { ChangeTodolistFilterType, RemoveTaskArgType, UpdateTodolistArgType } from "common/types";
import { useActions } from "common/hooks/useActions";

type Props = {};
export const TodolistsList = (props: Props) => {
  const todoLists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {
    fetchTodolists,
    removeAllTodolists,
    createTodolist,
    removeTask,
    removeTodolist,
    changeFilter,
    updateTask,
    createTask,
    changeTitleTodolist,
  } = useActions();
  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    fetchTodolists();
  }, [isLoggedIn]);

  const removeAllTodoLists = useCallback(() => {
    removeAllTodolists();
  }, []); // + tests

  const addTodoList = useCallback((title: string) => {
    createTodolist(title);
  }, []); // + tests

  const removeTaskCallback = useCallback((arg: RemoveTaskArgType) => {
    removeTask(arg);
  }, []); // + tests

  const removeTodolistCallback = useCallback((todoId: string) => {
    removeTodolist(todoId);
  }, []); // + tests

  const changeFilterCallback = useCallback((arg: ChangeTodolistFilterType) => {
    changeFilter(arg);
  }, []); // + tests

  const updateTaskCallback = useCallback((task: TaskPropsType) => {
    updateTask(task);
  }, []);

  const addTask = useCallback((arg: UpdateTodolistArgType) => {
    createTask(arg);
  }, []); // + tests

  const changeTitleTodolistCallback = useCallback((arg: UpdateTodolistArgType) => {
    changeTitleTodolist(arg);
  }, []); // + tests

  if (!isLoggedIn) {
    return <Navigate to={PATH.LOGIN} />;
  }

  const todoListsElements =
    todoLists.length === 0 ? (
      <SpanMessage>There are no todolists</SpanMessage>
    ) : (
      todoLists.map((tl) => {
        return (
          <Grid key={tl.id}>
            <Paper elevation={3} sx={{ p: "0 20px 20px 20px" }}>
              <Todolist
                todolist={tl}
                tasks={tasks[tl.id]}
                changeFilter={changeFilterCallback}
                removeTask={removeTaskCallback}
                removeTodolist={removeTodolistCallback}
                addTask={addTask}
                changeTitleTodolist={changeTitleTodolistCallback}
                updateTask={updateTaskCallback}
              />
            </Paper>
          </Grid>
        );
      })
    );

  return (
    <>
      <Grid container sx={{ mb: "30px", flexDirection: "column", alignItems: "baseline" }}>
        <AddItemForm
          addItem={addTodoList}
          placeholder={"Add a new todolists..."}
          textFieldLabel={"New todolists"}
          disabled={false}
        />
        <Button
          children={"DELETE ALL TODOLISTS"}
          onClick={removeAllTodoLists}
          variant="outlined"
          endIcon={<DeleteIcon />}
          color={"primary"}
          sx={{ mt: "10px" }}
        />
      </Grid>
      <Grid container spacing={4} ref={listRef}>
        {todoListsElements}
      </Grid>
    </>
  );
};

const SpanMessage = styled.span`
  display: inline-block;
  padding: 0 15px;
`;
