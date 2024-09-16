// @flow
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { todolistsActions } from "features/TodolistsList/todolistsSlice";
import { TaskPropsType, tasksActions } from "features/TodolistsList/tasksSlice";
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
import { ChangeTodolistFilterType, RemoveTaskArgType, UpdateTodolistArgType } from "common/api/todolistsApi";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type Props = {};
export const TodolistsList = (props: Props) => {
  const todoLists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    dispatch(todolistsActions.fetchTodolists());
  }, [dispatch, isLoggedIn]);

  const removeAllTodoLists = useCallback(() => {
    dispatch(todolistsActions.removeAllTodolists());
  }, [dispatch]); // + tests

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(todolistsActions.createTodolist(title));
    },
    [dispatch],
  ); // + tests

  const removeTask = useCallback(
    (arg: RemoveTaskArgType) => {
      dispatch(tasksActions.removeTask(arg));
    },
    [dispatch],
  ); // + tests

  const removeTodolist = useCallback(
    (todoId: string) => {
      dispatch(todolistsActions.removeTodolist(todoId));
    },
    [dispatch],
  ); // + tests

  const changeFilter = useCallback(
    (arg: ChangeTodolistFilterType) => {
      dispatch(todolistsActions.changeFilter(arg));
    },
    [dispatch],
  ); // + tests

  const updateTask = useCallback(
    (task: TaskPropsType) => {
      dispatch(tasksActions.updateTask(task));
    },
    [dispatch],
  );

  const addTask = useCallback(
    (arg: UpdateTodolistArgType) => {
      dispatch(tasksActions.createTask(arg));
    },
    [dispatch],
  ); // + tests

  const changeTitleTodolist = useCallback(
    (arg: UpdateTodolistArgType) => {
      dispatch(todolistsActions.changeTitleTodolist(arg));
    },
    [dispatch],
  ); // + tests

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
                changeFilter={changeFilter}
                removeTask={removeTask}
                removeTodolist={removeTodolist}
                addTask={addTask}
                changeTitleTodolist={changeTitleTodolist}
                updateTask={updateTask}
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
