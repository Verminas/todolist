// @flow
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist";
import { AddItemForm } from "common/components";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Navigate } from "react-router-dom";
import { PATH } from "common/router";
import { selectIsLoggedIn } from "features/auth/model/authSlice";
import { selectTodolists } from "features/TodolistsList/model/todolists/todolistsSlice";
import styled from "styled-components";
import { useActions } from "common/hooks";
import { buttonSx, gridHeadSx, paperSx } from "features/TodolistsList/ui/TodolistsList.styles";

export const TodolistsList = () => {
  // for style
  const [listRef] = useAutoAnimate<HTMLUnknownElement>();
  const todoLists = useSelector(selectTodolists);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { fetchTodolists, removeAllTodolists, createTodolist } = useActions();
  const isEmptyTodolistsList = todoLists.length === 0;

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    fetchTodolists();
  }, [isLoggedIn, fetchTodolists]);

  const removeAllTodoLists = useCallback(() => {
    removeAllTodolists();
  }, [removeAllTodolists]); // + tests

  const addTodoList = useCallback(
    (title: string) => {
      return createTodolist(title);
    },
    [createTodolist],
  ); // + tests

  if (!isLoggedIn) {
    return <Navigate to={PATH.LOGIN} />;
  }

  const todoListsElements = isEmptyTodolistsList ? (
    <SpanMessage>There are no todolists</SpanMessage>
  ) : (
    todoLists.map((tl) => {
      return (
        <Grid key={tl.id}>
          <Paper elevation={3} sx={paperSx}>
            <Todolist todolist={tl} />
          </Paper>
        </Grid>
      );
    })
  );

  return (
    <>
      <Grid container sx={gridHeadSx}>
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
          sx={buttonSx}
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
