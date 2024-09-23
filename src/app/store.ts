import { tasksReducer } from "features/TodolistsList/tasksSlice";
import { todolistsSlice } from "features/TodolistsList/todolistsSlice";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { appReducer } from "app/appSlice";
import { authReducer } from "features/auth/model/authSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsSlice,
    app: appReducer,
    auth: authReducer,
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
