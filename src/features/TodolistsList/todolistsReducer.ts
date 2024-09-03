import { todolistAPI, TodoListTypeDomain } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType, AppThunkDispatch } from "app/store";
import { RequestStatusType, setAppStatus } from "app/appReducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { fetchTasksTC } from "./tasksReducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistType[],
  reducers: {
    setTodolists(state, action: PayloadAction<{ todolists: TodoListTypeDomain[] }>) {
      action.payload.todolists.forEach((tl) => {
        state.push({ ...tl, filter: "all", entityStatus: "idle" });
      });
    },
    removeTodolist(state, action: PayloadAction<{ todoId: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todoId);
      if (index > -1) state.splice(index, 1);
    },
    removeAllTodoLists(state, action: PayloadAction) {
      return [];
    },
    changeFilter(state, action: PayloadAction<{ todoId: string; filter: FilterValueType }>) {
      const todo = state.find((tl) => tl.id === action.payload.todoId);
      if (todo) todo.filter = action.payload.filter;
    },
    changeTitle(state, action: PayloadAction<{ todoId: string; title: string }>) {
      const todo = state.find((tl) => tl.id === action.payload.todoId);
      if (todo) todo.title = action.payload.title;
    },
    createTodolist(state, action: PayloadAction<{ todo: TodoListTypeDomain }>) {
      state.unshift({ ...action.payload.todo, filter: "all", entityStatus: "idle" });
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) {
      const todo = state.find((tl) => tl.id === action.payload.todoId);
      if (todo) todo.entityStatus = action.payload.entityStatus;
    },
    clearTodosData(state, action: PayloadAction) {
      return [];
    },
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
const {
  changeTodolistEntityStatus,
  changeTitle,
  changeFilter,
  createTodolist,
  removeTodolist,
  setTodolists,
  removeAllTodoLists,
  clearTodosData,
} = slice.actions;

export type TodolistType = TodoListTypeDomain & { filter: FilterValueType; entityStatus: RequestStatusType };

export type FilterValueType = "all" | "active" | "completed";

// thunk creators
export const fetchTodolistsTC = () => {
  return (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistAPI
      .getTodolists()
      .then((data) => {
        dispatch(setTodolists({ todolists: data }));
        dispatch(setAppStatus({ status: "succeeded" }));
        return data;
      })
      .then((todos) => todos.forEach((tl) => dispatch(fetchTasksTC(tl.id))))
      .catch((err) => handleServerNetworkError(err, dispatch));
  };
};
export const removeTodolistTC = (todoId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
    todolistAPI
      .removeTodolist(todoId)
      .then((data) => {
        if (data.resultCode === 0) {
          dispatch(removeTodolist({ todoId }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(data, dispatch);
          dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "failed" }));
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
export const removeAllTodolistsTC = () => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const todolists = getState().todolists;
    dispatch(setAppStatus({ status: "loading" }));
    todolists.forEach((tl) => dispatch(changeTodolistEntityStatus({ todoId: tl.id, entityStatus: "loading" })));
    const promises = todolists.map((tl) => todolistAPI.removeTodolist(tl.id));
    Promise.all(promises)
      .then((data) => {
        console.log(data);
        if (data.every((d) => d.resultCode === 0)) {
          dispatch(removeAllTodoLists());
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          data.forEach((d) => {
            handleServerAppError(d, dispatch);
          });
          todolists.forEach((tl) => dispatch(changeTodolistEntityStatus({ todoId: tl.id, entityStatus: "failed" })));
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
export const createTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistAPI
      .createTodolist(title)
      .then((data) => {
        if (data.resultCode === 0) {
          dispatch(createTodolist({ todo: data.data.item }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(data, dispatch);
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
export const changeTitleTodolistTC = (todoId: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
    todolistAPI
      .updateTodolist(todoId, title)
      .then((data) => {
        if (data.resultCode === 0) {
          dispatch(changeTitle({ todoId, title }));
          dispatch(setAppStatus({ status: "succeeded" }));
          dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "succeeded" }));
        } else {
          handleServerAppError(data, dispatch);
          dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "failed" }));
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
