import React, { useEffect, useState } from "react";
import { tasksApi } from "features/TodolistsList/api/tasksApi";

export default {
  title: "API Tasks",
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  const todoID = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  useEffect(() => {
    tasksApi.getTasks(todoID).then((res) => {
      setState(res);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const todoID = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  const title = `New Task ${new Date().toISOString()}`;
  useEffect(() => {
    tasksApi.createTask({ title, todoId: todoID }).then((res) => {
      setState(res);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const todoId = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  const taskId = "857cfd6a-2348-4adc-9926-8cf6e9490a9a";
  useEffect(() => {
    tasksApi.removeTask({ taskId, todoId }).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null);
  const todoId = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  const taskId = "2acdf418-3e09-43ec-831a-6889a3e5eb7b";
  const task = {
    title: "new title",
    startDate: "",
    status: 0,
    description: "",
    priority: 0,
    deadline: "",
    completed: false,
  };
  useEffect(() => {
    tasksApi.updateTask({ taskId, todoId, task }).then((res) => {
      setState(res);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
