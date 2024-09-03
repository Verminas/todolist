import { tasksReducer } from "features/TodolistsList/tasksReducer";
import { todolistsReducer } from "features/TodolistsList/todolistsReducer";
import { AnyAction, applyMiddleware, combineReducers, createStore } from "redux";
import { thunk, ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";
import { appReducer } from "app/appReducer";
import { authReducer } from "features/Login/authReducer";
import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware, { ThunkAction } from "redux-thunk";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

// export const store = createStore(rootReducer, {}, applyMiddleware(thunk));

export const store = configureStore({
  reducer: rootReducer,
  // middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();

// @ts-ignore
window.store = store;
