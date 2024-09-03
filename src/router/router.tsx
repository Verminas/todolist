import React from "react";
import App from "../app/App";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { Login } from "features/Login/Login";
import { ErrorPage } from "components/ErrorPage/ErrorPage";

export const PATH = {
  COMMON: "/",
  ERROR: "/404",
  LOGIN: "/login",
  TODOS: "/todolists",
};
export const router = createBrowserRouter([
  {
    path: PATH.COMMON,
    element: <App />,
    errorElement: <Navigate to={PATH.ERROR} />,
    children: [
      {
        index: true,
        element: <Navigate to={PATH.TODOS} />,
      },
      {
        path: PATH.LOGIN,
        element: <Login />,
      },
      {
        path: PATH.TODOS,
        element: <TodolistsList />,
      },
    ],
  },
  {
    path: PATH.ERROR,
    element: <ErrorPage />,
  },
]);
