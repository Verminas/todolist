// @flow
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/store";
import { fetchTodolists, FilterValueType, todolistsActions, todolistsThunks } from "./todolistsReducer";
import { TaskPropsType, tasksThunks } from "./tasksReducer";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Navigate } from "react-router-dom";

import { PATH } from "router/router";
import { selectIsLoggedIn } from "features/Login/authSelectors";
import { selectTodolists } from "features/TodolistsList/todolistsSelector";
import { selectTasks } from "features/TodolistsList/tasksSelector";
import styled from "styled-components";

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

    dispatch(fetchTodolists());
  }, [dispatch, isLoggedIn]);

  const removeAllTodoLists = useCallback(() => {
    dispatch(todolistsThunks.removeAllTodolists());
  }, [dispatch]); // + tests

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.createTodolist(title));
    },
    [dispatch],
  ); // + tests

  const removeTask = useCallback(
    (taskId: string, todoId: string) => {
      dispatch(tasksThunks.removeTask({ todoId, taskId }));
    },
    [dispatch],
  ); // + tests

  const removeTodolist = useCallback(
    (todoId: string) => {
      dispatch(todolistsThunks.removeTodolist(todoId));
    },
    [dispatch],
  ); // + tests

  const changeFilter = useCallback(
    (filter: FilterValueType, todoId: string) => {
      dispatch(todolistsActions.changeFilter({ todoId, filter }));
    },
    [dispatch],
  ); // + tests

  const updateTask = useCallback(
    (task: TaskPropsType) => {
      dispatch(tasksThunks.updateTask(task));
    },
    [dispatch],
  );

  const addTask = useCallback(
    (title: string, todoId: string) => {
      dispatch(tasksThunks.createTask({ todoId, title }));
    },
    [dispatch],
  ); // + tests

  const changeTitleTodolist = useCallback(
    (title: string, todoId: string) => {
      dispatch(todolistsThunks.changeTitleTodolist({ todoId, title }));
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
