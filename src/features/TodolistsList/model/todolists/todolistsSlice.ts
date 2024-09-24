import { todolistAPI } from "features/TodolistsList/api/todolistsApi";
import { RequestStatusType } from "app/appSlice";
import { tasksActions } from "features/TodolistsList/model/tasks/tasksSlice";
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

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "todolists",
  initialState: [] as TodolistType[],
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null | BaseResponse | unknown }>();
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
          const { dispatch } = thunkAPI;

          const todolists = await todolistAPI.getTodolists();
          todolists.forEach((tl) => dispatch(tasksActions.fetchTasks(tl.id)));
          return { todolists };
        },
        {
          fulfilled: (_, action) => {
            return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
          },
        },
      ),
      removeTodolist: createAThunk<RemoveTodolistArgType, string>(
        async (todoId, thunkAPI) => {
          const { rejectWithValue } = thunkAPI;

          const res = await todolistAPI.removeTodolist(todoId);
          if (res.resultCode === ResultCode.Success) {
            return { todoId };
          } else {
            return rejectWithValue(res.data);
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.todoId);
            if (index > -1) state.splice(index, 1);
          },
          pending: (state, action) => {
            const todolist = state.find((tl) => tl.id === action.meta.arg);
            if (todolist) {
              todolist.entityStatus = "loading";
            }
          },
          rejected: (state, action) => {
            const todolist = state.find((tl) => tl.id === action.meta.arg);
            if (todolist) {
              todolist.entityStatus = "failed";
            }
          },
        },
      ),
      removeAllTodolists: createAThunk<void, undefined>(
        async (_, thunkAPI) => {
          const { rejectWithValue, getState } = thunkAPI;
          const todolists: TodolistType[] = (getState() as AppRootStateType).todolists;

          const promises = todolists.map((tl) => todolistAPI.removeTodolist(tl.id));
          const results = await Promise.all(promises);

          results.forEach((r) => {
            if (r.resultCode !== ResultCode.Success) {
              return rejectWithValue(r);
            }
          });
        },
        {
          fulfilled: () => {
            return [];
          },
          pending: (state) => {
            state.forEach((tl) => {
              tl.entityStatus = "loading";
            });
          },
          rejected: (state) => {
            state.forEach((tl) => {
              tl.entityStatus = "failed";
            });
          },
        },
      ),
      createTodolist: createAThunk<TodolistObjType, string>(
        async (title, thunkAPI) => {
          const { rejectWithValue } = thunkAPI;

          const res = await todolistAPI.createTodolist(title);
          if (res.resultCode === ResultCode.Success) {
            const todolist = res.data.item;
            return { todolist };
          } else {
            return rejectWithValue(res);
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
          },
        },
      ),
      changeTitleTodolist: createAThunk<UpdateTodolistArgType, UpdateTodolistArgType>(
        async (arg, thunkAPI) => {
          const { rejectWithValue } = thunkAPI;

          const res = await todolistAPI.updateTodolist(arg);
          if (res.resultCode === ResultCode.Success) {
            return arg;
          } else {
            return rejectWithValue(res);
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
