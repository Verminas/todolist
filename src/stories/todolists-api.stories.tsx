import React, { useEffect, useState } from "react";
import axios from "axios";
import { todolistAPI } from "api/todolistsApi";

export default {
  title: "API Todolists",
};

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todolistAPI.getTodolists().then((res) => {
      setState(res);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const newTitle = "New Todo";
    todolistAPI.createTodolist(newTitle).then((res) => {
      setState(res);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoID = "2752372e-2601-4113-aa00-76097a2f5835";
    todolistAPI.removeTodolist(todoID).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoID = "2752372e-2601-4113-aa00-76097a2f5835";
    const newTitle = "New title for todo";
    todolistAPI.updateTodolist(todoID, newTitle).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
