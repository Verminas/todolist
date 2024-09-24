// @flow
import * as React from "react";
import List from "@mui/material/List";
import styled from "styled-components";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Task } from "features/TodolistsList/ui/Todolist/TasksList/Task/Task";
import { useAppSelector } from "app/store";
import { TodolistType } from "features/TodolistsList/model/todolists/todolistsSlice";
import { selectTasks } from "features/TodolistsList/model/tasks/tasksSlice";

type Props = {
  todolist: TodolistType;
  todolistIsLoading: boolean;
};

export const TasksList = ({ todolistIsLoading, todolist }: Props) => {
  // animation for list tasks
  const [listRef] = useAutoAnimate<HTMLUListElement>();
  const { filter, id } = todolist;
  const tasks = useAppSelector((state) => selectTasks(state, { id, filter }));
  const isTasksListEmpty = tasks.length === 0;

  const tasksElements = tasks.map((t) => {
    return <Task task={t} todolistIsLoading={todolistIsLoading} key={t.id} />;
  });

  return (
    <>
      {isTasksListEmpty ? <SpanMessage>There are not tasks</SpanMessage> : <List ref={listRef}>{tasksElements}</List>}
    </>
  );
};

const SpanMessage = styled.span`
  display: inline-block;
  padding: 8px 5px;
`;
