import React, { useEffect, useState } from "react";
import { todolistAPI } from "api/todolistsApi";

export default {
  title: "API Tasks",
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  const todoID = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  useEffect(() => {
    todolistAPI.getTasks(todoID).then((res) => {
      setState(res);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const todoID = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  const newTitle = `New Task ${new Date().toISOString()}`;
  useEffect(() => {
    todolistAPI.createTask(todoID, newTitle).then((res) => {
      setState(res);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const todoID = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  const taskID = "857cfd6a-2348-4adc-9926-8cf6e9490a9a";
  useEffect(() => {
    todolistAPI.removeTask(todoID, taskID).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null);
  const todoID = "b99dbdd9-b81e-4680-aa7e-9ed553f81dbd";
  const taskID = "2acdf418-3e09-43ec-831a-6889a3e5eb7b";
  useEffect(() => {
    todolistAPI
      .updateTask(todoID, taskID, {
        title: "new title",
        startDate: "",
        status: 0,
        description: "",
        priority: 0,
        deadline: "",
        completed: false,
      })
      .then((res) => {
        setState(res);
      });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
