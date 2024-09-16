import { todolistAPI } from "features/TodolistsList/todolistsApi";
import { RequestStatusType } from "app/appSlice";
import { tasksActions } from "features/TodolistsList/tasksSlice";
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode } from "common/enums";
import { AppRootStateType } from "app/store";
import {
  BaseResponse,
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
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null | BaseResponse }>();
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
        (_, thunkAPI) => {
          const { dispatch } = thunkAPI;

          return thunkTryCatch(thunkAPI, async () => {
            const todolists = await todolistAPI.getTodolists();
            todolists.forEach((tl) => dispatch(tasksActions.fetchTasks(tl.id)));
            return { todolists };
          });
        },
        {
          fulfilled: (_, action) => {
            return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
          },
        },
      ),
      removeTodolist: createAThunk<RemoveTodolistArgType, string>(
        (todoId, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;

          return thunkTryCatch(
            thunkAPI,
            async () => {
              const res = await todolistAPI.removeTodolist(todoId);
              if (res.resultCode === ResultCode.Success) {
                return { todoId };
              } else {
                handleServerAppError(res, dispatch);
                return rejectWithValue(null);
              }
            },
            { todoId },
          );
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.todoId);
            if (index > -1) state.splice(index, 1);
          },
        },
      ),
      removeAllTodolists: createAThunk<undefined, undefined>(
        (_, thunkAPI) => {
          const { dispatch, rejectWithValue, getState } = thunkAPI;
          const todolists: TodolistType[] = (getState() as AppRootStateType).todolists;

          return thunkTryCatch(
            thunkAPI,
            async () => {
              const promises = todolists.map((tl) => todolistAPI.removeTodolist(tl.id));
              const results = await Promise.all(promises);

              if (results.some((r) => r.resultCode !== ResultCode.Success)) {
                results.forEach((r) => {
                  if (r.resultCode !== ResultCode.Success) handleServerAppError(r, dispatch);
                });

                return rejectWithValue(null);
              }
            },
            { todolists },
          );
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
        (arg, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;

          return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistAPI.updateTodolist(arg);
            if (res.resultCode === ResultCode.Success) {
              return arg;
            } else {
              handleServerAppError(res, dispatch);
              return rejectWithValue(null);
            }
          });
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
