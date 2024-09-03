import React, { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import styled from "styled-components";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import List from "@mui/material/List";
import { filterButtonsContainerSx } from "./Todolist.styles";
import { TaskItem } from "components/TaskItem/TaskItem";
import { FilterValueType } from "../todolistsReducer";
import { TaskPropsType } from "../tasksReducer";
import { RequestStatusType } from "app/appReducer";

type TodolistPropsType = {
  id: string;
  title: string;
  tasks: Array<TaskPropsType>;
  entityStatus: RequestStatusType;

  changeTitleTodolist: (value: string, todoId: string) => void;
  updateTask: (todoId: string, taskId: string, title: string, isDone: boolean) => void;
  removeTask: (id: string, todoId: string) => void;
  changeFilter: (value: FilterValueType, todoId: string) => void;
  removeTodolist: (todoId: string) => void;
  addTask: (value: string, todoId: string) => void;
  filter: FilterValueType;
};

export const Todolist = memo(
  ({
    id,
    title,
    tasks,
    entityStatus,
    changeFilter,
    removeTask,
    removeTodolist,
    changeTitleTodolist,
    addTask,
    updateTask,
    filter,
  }: TodolistPropsType) => {
    // animation for list tasks
    const [listRef] = useAutoAnimate<HTMLUListElement>();

    const todolistIsLoading = entityStatus === "loading";

    const addTaskHandler = useCallback(
      (value: string) => {
        addTask(value, id);
      },
      [addTask, id],
    );

    const onAllClickChangeFilterHandler = useCallback(() => {
      changeFilter("all", id);
    }, [changeFilter, id]);
    const onActiveClickChangeFilterHandler = useCallback(() => {
      changeFilter("active", id);
    }, [changeFilter, id]);
    const onCompletedClickChangeFilterHandler = useCallback(() => {
      changeFilter("completed", id);
    }, [changeFilter, id]);

    const changeTitleTodolistHandler = useCallback(
      (value: string) => {
        changeTitleTodolist(value, id);
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
        <TaskItem
          id={t.id}
          todoId={id}
          key={t.id}
          title={t.title}
          isDone={t.isDone}
          removeTask={removeTask}
          updateTask={updateTask}
          entityStatus={todolistIsLoading ? "loading" : t.entityStatus}
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
        {tasks.length === 0 ? <span>There are not tasks</span> : <List ref={listRef}>{tasksElements}</List>}
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
          />
          <Button
            children={"Completed"}
            onClick={onCompletedClickChangeFilterHandler}
            variant={filter === "completed" ? "outlined" : "text"}
            color={"secondary"}
            size={"small"}
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
