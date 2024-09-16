import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { Login } from "features/auth/Login";
import { ErrorPage } from "common/components/ErrorPage/ErrorPage";
import App from "app/App";

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
