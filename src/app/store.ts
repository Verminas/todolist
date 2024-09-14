import { tasksReducer } from "features/TodolistsList/tasksSlice";
import { todolistsSlice } from "features/TodolistsList/todolistsSlice";
import { AnyAction, combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";
import { appReducer } from "app/appSlice";
import { authReducer } from "features/Login/authSlice";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsSlice,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();

// @ts-ignore
window.store = store;
