import React, { memo, useCallback } from "react";
import { AddItemForm } from "common/components";
import { TodolistType } from "features/TodolistsList/model/todolistsSlice";
import { useActions } from "common/hooks";
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons";
import { TasksList } from "features/TodolistsList/ui/Todolist/TasksList/TasksList";
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle";

type Props = {
  todolist: TodolistType;
};

export const Todolist = memo(({ todolist }: Props) => {
  const { createTask } = useActions();
  const { id, title, entityStatus } = todolist;
  console.log("title of todo", title);

  const todolistIsLoading = entityStatus === "loading";

  const addTaskHandler = useCallback(
    (title: string) => {
      return createTask({ todoId: id, title });
    },
    [createTask, id],
  );

  return (
    <div>
      <TodolistTitle todolist={todolist} todolistIsLoading={todolistIsLoading} />
      <AddItemForm
        addItem={addTaskHandler}
        textFieldLabel={"New task"}
        placeholder={"Add a new task..."}
        disabled={todolistIsLoading}
      />
      <TasksList todolist={todolist} todolistIsLoading={todolistIsLoading} />
      <FilterTasksButtons todolist={todolist} />
    </div>
  );
});
