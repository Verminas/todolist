// @flow
import * as React from "react";
import { filterButtonsContainerSx } from "features/TodolistsList/ui/Todolist/Todolist.styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useCallback } from "react";
import { FilterValueType, TodolistType } from "features/TodolistsList/model/todolistsSlice";
import { useActions } from "common/hooks";

type Props = {
  todolist: TodolistType;
};
export const FilterTasksButtons = ({ todolist }: Props) => {
  const { filter, id } = todolist;
  const { changeFilter } = useActions();

  const onChangeTasksFilter = useCallback(
    (filter: FilterValueType) => {
      changeFilter({ todoId: id, filter });
    },
    [changeFilter, id],
  );

  return (
    <Box sx={filterButtonsContainerSx}>
      <Button
        children={"All"}
        onClick={() => onChangeTasksFilter("all")}
        variant={filter === "all" ? "outlined" : "text"}
        color={"inherit"}
        size={"small"}
      />
      <Button
        children={"Active"}
        onClick={() => onChangeTasksFilter("active")}
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        size={"small"}
      />
      <Button
        children={"Completed"}
        onClick={() => onChangeTasksFilter("completed")}
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        size={"small"}
      />
    </Box>
  );
};
