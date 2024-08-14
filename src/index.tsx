import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import {store} from "./app/store";
import {Provider} from "react-redux";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";

import {TodolistsList} from "./features/TodolistsList/TodolistsList";
import {Login} from "./features/Login/Login";
import {ErrorPage} from "./components/ErrorPage/ErrorPage";


export const PATH = {
  COMMON: '/',
  ERROR: '/404',
  LOGIN: '/login',
  TODOS: '/todolists'
}

const router = createBrowserRouter([
  {
    path: PATH.COMMON,
    element: <App/>,
    errorElement: <Navigate to={PATH.ERROR}/>,
    children: [
      {
        index: true,
        element: <Navigate to={PATH.TODOS}/>,
      },
      {
        path: PATH.LOGIN,
        element: <Login/>,
      },
      {
        path: PATH.TODOS,
        element: <TodolistsList/>,
      },
    ]
  },
  {
    path: PATH.ERROR,
    element: <ErrorPage/>,
  }
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

