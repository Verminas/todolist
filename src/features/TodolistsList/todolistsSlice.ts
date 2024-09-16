import { todolistAPI } from "features/TodolistsList/todolistsApi";
import { RequestStatusType, setAppStatus } from "app/appSlice";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { tasksActions } from "features/TodolistsList/tasksSlice";
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode } from "common/enums";
import { AppRootStateType, AppDispatch } from "app/store";
import {
  RemoveTodolistArgType,
  TodolistObjType,
  TodolistsObjType,
  TodoListTypeDomain,
  UpdateTodolistArgType,
} from "common/types";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { thunkTryCatch } from "common/utils/thunkTryCatch";

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "todolists",
  initialState: [] as TodolistType[],
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>();
    return {
      changeFilter: creators.reducer(
        (
          state,
          action: PayloadAction<{
            todoId: string;
            filter: FilterValueType;
          }>,
        ) => {
          const todo = state.find((tl) => tl.id === action.payload.todoId);
          if (todo) todo.filter = action.payload.filter;
        },
      ),
      changeTodolistEntityStatus: creators.reducer(
        (state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) => {
          const todo = state.find((tl) => tl.id === action.payload.todoId);
          if (todo) todo.entityStatus = action.payload.entityStatus;
        },
      ),
      clearTodosData: creators.reducer((_, action: PayloadAction) => {
        return [];
      }),
      fetchTodolists: createAThunk<TodolistsObjType>(
        async (_, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          const appDispatch = dispatch as AppDispatch;
          try {
            appDispatch(setAppStatus({ status: "loading" }));
            const res = await todolistAPI.getTodolists();
            appDispatch(setAppStatus({ status: "succeeded" }));
            res.forEach((tl) => appDispatch(tasksActions.fetchTasks(tl.id)));
            return { todolists: res };
          } catch (err) {
            handleServerNetworkError(err, appDispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (_, action) => {
            return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
          },
        },
      ),
      removeTodolist: createAThunk<RemoveTodolistArgType, string>(
        async (todoId, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          try {
            dispatch(setAppStatus({ status: "loading" }));
            dispatch(todolistsActions.changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
            const res = await todolistAPI.removeTodolist(todoId);
            if (res.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }));
              return { todoId };
            } else {
              handleServerAppError(res, dispatch);
              dispatch(todolistsActions.changeTodolistEntityStatus({ todoId, entityStatus: "failed" }));
              return rejectWithValue(null);
            }
          } catch (err) {
            handleServerNetworkError(err, dispatch as AppDispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.todoId);
            if (index > -1) state.splice(index, 1);
          },
        },
      ),
      removeAllTodolists: createAThunk<undefined, undefined>(
        async (_, thunkAPI) => {
          const { dispatch, rejectWithValue, getState } = thunkAPI;
          try {
            const todolists = (getState() as AppRootStateType).todolists;
            dispatch(setAppStatus({ status: "loading" }));
            todolists.forEach((tl) =>
              dispatch(
                todolistsActions.changeTodolistEntityStatus({
                  todoId: tl.id,
                  entityStatus: "loading",
                }),
              ),
            );
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
                  todolistsActions.changeTodolistEntityStatus({
                    todoId: tl.id,
                    entityStatus: "failed",
                  }),
                ),
              );

              return rejectWithValue(null);
            }
          } catch (err) {
            handleServerNetworkError(err, dispatch as AppDispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: () => {
            return [];
          },
        },
      ),
      createTodolist: createAThunk<TodolistObjType, string>(
        (title, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistAPI.createTodolist(title);
            if (res.resultCode === ResultCode.Success) {
              const todolist = res.data.item;
              return { todolist };
            } else {
              handleServerAppError(res, dispatch);
              return rejectWithValue(null);
            }
          });
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
          },
        },
      ),
      changeTitleTodolist: createAThunk<UpdateTodolistArgType, UpdateTodolistArgType>(
        async (arg, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          const { todoId } = arg;
          try {
            dispatch(setAppStatus({ status: "loading" }));
            dispatch(todolistsActions.changeTodolistEntityStatus({ todoId, entityStatus: "loading" }));
            const res = await todolistAPI.updateTodolist(arg);
            if (res.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }));
              dispatch(todolistsActions.changeTodolistEntityStatus({ todoId, entityStatus: "succeeded" }));
              return arg;
            } else {
              handleServerAppError(res, dispatch);
              dispatch(todolistsActions.changeTodolistEntityStatus({ todoId, entityStatus: "failed" }));
              return rejectWithValue(null);
            }
          } catch (err) {
            handleServerNetworkError(err, dispatch as AppDispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            const todo = state.find((tl) => tl.id === action.payload.todoId);
            if (todo) todo.title = action.payload.title;
          },
        },
      ),
    };
  },
  selectors: {
    selectTodolists: (sliceState) => sliceState,
  },
});

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const { selectTodolists } = slice.selectors;

export type TodolistType = TodoListTypeDomain & { filter: FilterValueType; entityStatus: RequestStatusType };
export type FilterValueType = "all" | "active" | "completed";
