import { tasksReducer } from "features/TodolistsList/model/tasksSlice";
import { todolistsSlice } from "features/TodolistsList/model/todolistsSlice";
import { appReducer } from "app/appSlice";
import { authReducer } from "features/auth/model/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

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
export const useAppSelector = useSelector.withTypes<AppRootStateType>();

// @ts-ignore
window.store = store;
