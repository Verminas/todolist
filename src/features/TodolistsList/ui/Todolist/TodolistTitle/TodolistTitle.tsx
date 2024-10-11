// @flow
import * as React from "react";
import { EditableSpan } from "common/components";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";
import { useCallback } from "react";
import { useActions } from "common/hooks";
import { TodolistType } from "features/TodolistsList/model/todolistsSlice";

type Props = {
  todolist: TodolistType;
  todolistIsLoading: boolean;
};
export const TodolistTitle = ({ todolist, todolistIsLoading }: Props) => {
  const { title, id } = todolist;

  const { changeTitleTodolist, removeTodolist } = useActions();

  const changeTitleTodolistHandler = useCallback(
    (title: string) => {
      changeTitleTodolist({ todoId: id, title });
    },
    [changeTitleTodolist, id],
  );

  const removeTodolistHandler = () => {
    removeTodolist(id);
  };

  return (
    <WrapperTitle>
      <StyledTitle>
        <EditableSpan
          title={title}
          changeTitle={changeTitleTodolistHandler}
          textFieldLabel={"Todolist title"}
          disabled={todolistIsLoading}
        />
      </StyledTitle>
      <IconButton
        aria-label="delete todolist"
        onClick={removeTodolistHandler}
        size={"small"}
        disabled={todolistIsLoading}
      >
        <DeleteIcon />
      </IconButton>
    </WrapperTitle>
  );
};

const WrapperTitle = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledTitle = styled.h3`
  max-width: 350px;
  min-width: 50px;
`;
