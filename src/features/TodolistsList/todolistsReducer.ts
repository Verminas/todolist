import { todolistAPI, TodoListTypeDomain } from "api/todolistsApi";
import { RequestStatusType, setAppStatus } from "app/appReducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { tasksThunks } from "./tasksReducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode } from "enums";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";

export const fetchTodolists = createAppAsyncThunk<{
  todolists: TodoListTypeDomain[];
}>("todolists/fetchTodolists", async (_, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistAPI.getTodolists();
    dispatch(setAppStatus({ status: "succeeded" }));
    res.forEach((tl) => dispatch(tasksThunks.fetchTasks(tl.id)));

    return { todolists: res };
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const removeTodolist = createAppAsyncThunk<{ todoId: string }, string>(
  "todolists/removeTodolist",
  async (todoId, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus({ status: "loading" }));
    dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
    try {
      const res = await todolistAPI.removeTodolist(todoId);
      if (res.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todoId };
      } else {
        handleServerAppError(res, dispatch);
        dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const removeAllTodolists = createAppAsyncThunk(
  "todolists/removeAllTodolists",
  async (_, { dispatch, rejectWithValue, getState }) => {
    const todolists = getState().todolists;
    dispatch(setAppStatus({ status: "loading" }));
    todolists.forEach((tl) => dispatch(changeTodolistEntityStatus({ todoId: tl.id, entityStatus: "loading" })));
    try {
      const promises = todolists.map((tl) => todolistAPI.removeTodolist(tl.id));
      const results = await Promise.all(promises);

      if (results.every((r) => r.resultCode === ResultCode.Success)) {
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        results.forEach((r) => {
          handleServerAppError(r, dispatch);
        });
        todolists.forEach((tl) =>
          dispatch(
            changeTodolistEntityStatus({
              todoId: tl.id,
              entityStatus: "failed",
            }),
          ),
        );

        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const createTodolist = createAppAsyncThunk<
  {
    todo: TodoListTypeDomain;
  },
  string
>("todolists/createTodolist", async (title, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistAPI.createTodolist(title);
    if (res.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todo: res.data.item };
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const changeTitleTodolist = createAppAsyncThunk<
  { todoId: string; title: string },
  {
    todoId: string;
    title: string;
  }
>("todolists/changeTitleTodolist", async ({ todoId, title }, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus({ status: "loading" }));
  dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
  try {
    const res = await todolistAPI.updateTodolist(todoId, title);
    if (res.resultCode === ResultCode.Success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "succeeded" }));
      return { todoId, title };
    } else {
      handleServerAppError(res, dispatch);
      dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "failed" }));
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistType[],
  reducers: {
    changeFilter(state, action: PayloadAction<{ todoId: string; filter: FilterValueType }>) {
      const todo = state.find((tl) => tl.id === action.payload.todoId);
      if (todo) todo.filter = action.payload.filter;
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) {
      const todo = state.find((tl) => tl.id === action.payload.todoId);
      if (todo) todo.entityStatus = action.payload.entityStatus;
    },
    clearTodosData(state, action: PayloadAction) {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todoId);
        if (index > -1) state.splice(index, 1);
      })
      .addCase(removeAllTodolists.fulfilled, (state, action) => {
        return [];
      })
      .addCase(createTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todo, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTitleTodolist.fulfilled, (state, action) => {
        const todo = state.find((tl) => tl.id === action.payload.todoId);
        if (todo) todo.title = action.payload.title;
      });
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const { changeTodolistEntityStatus, changeFilter, clearTodosData } = slice.actions;

export const todolistsThunks = {
  fetchTodolists,
  removeTodolist,
  removeAllTodolists,
  createTodolist,
  changeTitleTodolist,
};

export type TodolistType = TodoListTypeDomain & { filter: FilterValueType; entityStatus: RequestStatusType };
export type FilterValueType = "all" | "active" | "completed";
