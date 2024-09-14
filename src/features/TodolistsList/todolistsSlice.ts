import {
  RemoveTodolistArgType,
  todolistAPI,
  TodolistObjType,
  TodolistsObjType,
  TodoListTypeDomain,
  UpdateTodolistArgType,
} from "api/todolistsApi";
import { RequestStatusType, setAppStatus } from "app/appSlice";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { tasksThunks } from "features/TodolistsList/tasksSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode } from "enums";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";

export const fetchTodolists = createAppAsyncThunk<TodolistsObjType>("todolists/fetchTodolists", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const res = await todolistAPI.getTodolists();
    dispatch(setAppStatus({ status: "succeeded" }));
    res.forEach((tl) => dispatch(tasksThunks.fetchTasks(tl.id)));
    return { todolists: res };
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const removeTodolist = createAppAsyncThunk<RemoveTodolistArgType, string>(
  "todolists/removeTodolist",
  async (todoId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
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

export const removeAllTodolists = createAppAsyncThunk("todolists/removeAllTodolists", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  try {
    const todolists = getState().todolists;
    dispatch(setAppStatus({ status: "loading" }));
    todolists.forEach((tl) => dispatch(changeTodolistEntityStatus({ todoId: tl.id, entityStatus: "loading" })));
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
});

export const createTodolist = createAppAsyncThunk<TodolistObjType, string>(
  "todolists/createTodolist",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistAPI.createTodolist(title);
      if (res.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolist: res.data.item };
      } else {
        handleServerAppError(res, dispatch);
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const changeTitleTodolist = createAppAsyncThunk<UpdateTodolistArgType, UpdateTodolistArgType>(
  "todolists/changeTitleTodolist",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todoId } = arg;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
      const res = await todolistAPI.updateTodolist(arg);
      if (res.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(changeTodolistEntityStatus({ todoId, entityStatus: "succeeded" }));
        return arg;
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
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTitleTodolist.fulfilled, (state, action) => {
        const todo = state.find((tl) => tl.id === action.payload.todoId);
        if (todo) todo.title = action.payload.title;
      });
  },
  selectors: {
    selectTodolists: (sliceState) => sliceState,
  },
});

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const { selectTodolists } = slice.selectors;
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
