import { tasksReducer } from "features/TodolistsList/tasksReducer";
import { todolistsReducer } from "features/TodolistsList/todolistsReducer";
import { AnyAction, applyMiddleware, combineReducers, createStore } from "redux";
import { thunk, ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";
import { appReducer } from "./app-reducer";
import { authReducer } from "features/Login/authReducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = createStore(rootReducer, {}, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();

// @ts-ignore
window.store = store;
