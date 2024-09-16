import React, { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import styled from "styled-components";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import List from "@mui/material/List";
import { filterButtonsContainerSx } from "./Todolist.styles";
import { Task } from "features/TodolistsList/Todolist/Task/Task";
import { TodolistType } from "features/TodolistsList/todolistsSlice";
import { TaskPropsType } from "features/TodolistsList/tasksSlice";
import { ChangeTodolistFilterType, RemoveTaskArgType, UpdateTodolistArgType } from "common/types";

type TodolistPropsType = {
  todolist: TodolistType;
  tasks: Array<TaskPropsType>;

  changeTitleTodolist: (arg: UpdateTodolistArgType) => void;
  updateTask: (task: TaskPropsType) => void;
  removeTask: (arg: RemoveTaskArgType) => void;
  changeFilter: (arg: ChangeTodolistFilterType) => void;
  removeTodolist: (todoId: string) => void;
  addTask: (arg: UpdateTodolistArgType) => void;
};

export const Todolist = memo(
  ({
    todolist: { filter, id, title, entityStatus },
    tasks,
    changeFilter,
    removeTask,
    removeTodolist,
    changeTitleTodolist,
    addTask,
    updateTask,
  }: TodolistPropsType) => {
    // animation for list tasks
    const [listRef] = useAutoAnimate<HTMLUListElement>();
    console.log("title of todo", title);

    const todolistIsLoading = entityStatus === "loading";

    const addTaskHandler = useCallback(
      (title: string) => {
        addTask({ todoId: id, title });
      },
      [addTask, id],
    );

    const onAllClickChangeFilterHandler = useCallback(() => {
      changeFilter({ todoId: id, filter: "all" });
    }, [changeFilter, id]);
    const onActiveClickChangeFilterHandler = useCallback(() => {
      changeFilter({ todoId: id, filter: "active" });
    }, [changeFilter, id]);
    const onCompletedClickChangeFilterHandler = useCallback(() => {
      changeFilter({ todoId: id, filter: "completed" });
    }, [changeFilter, id]);

    const changeTitleTodolistHandler = useCallback(
      (title: string) => {
        changeTitleTodolist({ todoId: id, title });
      },
      [changeTitleTodolist, id],
    );

    const removeTodolistHandler = () => {
      removeTodolist(id);
    };

    let filteredTasks = tasks;

    // можно закинуть в useMemo

    if (filter === "active") {
      filteredTasks = filteredTasks.filter((t) => !t.isDone);
    }
    if (filter === "completed") {
      filteredTasks = filteredTasks.filter((t) => t.isDone);
    }

    const tasksElements = filteredTasks.map((t) => {
      return (
        <Task
          task={t}
          removeTask={removeTask}
          updateTask={updateTask}
          key={t.id}
          todolistIsLoading={todolistIsLoading}
        />
      );
    });

    return (
      <div>
        <WrapperTitle>
          <h3>
            <EditableSpan
              title={title}
              changeTitle={changeTitleTodolistHandler}
              textFieldLabel={"Todolist title"}
              disabled={todolistIsLoading}
            />
          </h3>
          <IconButton
            aria-label="delete todolist"
            onClick={removeTodolistHandler}
            size={"small"}
            disabled={todolistIsLoading}
          >
            <DeleteIcon />
          </IconButton>
        </WrapperTitle>
        <AddItemForm
          addItem={addTaskHandler}
          textFieldLabel={"New task"}
          placeholder={"Add a new task..."}
          disabled={todolistIsLoading}
        />
        {filteredTasks.length === 0 ? (
          <SpanMessage>There are not tasks</SpanMessage>
        ) : (
          <List ref={listRef}>{tasksElements}</List>
        )}
        <Box sx={filterButtonsContainerSx}>
          <Button
            children={"All"}
            onClick={onAllClickChangeFilterHandler}
            variant={filter === "all" ? "outlined" : "text"}
            color={"inherit"}
            size={"small"}
          />
          <Button
            children={"Active"}
            onClick={onActiveClickChangeFilterHandler}
            variant={filter === "active" ? "outlined" : "text"}
            color={"primary"}
            size={"small"}
            disabled={tasks.length === 0}
          />
          <Button
            children={"Completed"}
            onClick={onCompletedClickChangeFilterHandler}
            variant={filter === "completed" ? "outlined" : "text"}
            color={"secondary"}
            size={"small"}
            disabled={tasks.length === 0}
          />
        </Box>
      </div>
    );
  },
);

const WrapperTitle = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SpanMessage = styled.span`
  display: inline-block;
  padding: 8px 5px;
`;
