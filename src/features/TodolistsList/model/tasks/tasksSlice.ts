import { FilterValueType, todolistsActions } from "features/TodolistsList/model/todolists/todolistsSlice";
import { RequestStatusType } from "app/appSlice";
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode, TaskStatuses } from "common/enums";
import {
  BaseResponse,
  CreateTaskReturnArgType,
  FetchTasksArgType,
  RemoveTaskArgType,
  TaskResponseType,
  TaskUpdateModelType,
  UpdateTodolistArgType,
} from "common/types";
import { handleServerAppError, thunkTryCatch, getTaskUpdateModel } from "common/utils";
import { tasksApi } from "features/TodolistsList/api/tasksApi";

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null | BaseResponse }>();
    return {
      changeTaskEntityStatus: creators.reducer(
        (state, action: PayloadAction<{ todoId: string; taskId: string; entityStatus: RequestStatusType }>) => {
          const task = state[action.payload.todoId].find((t) => t.id === action.payload.taskId);
          if (task) task.entityStatus = action.payload.entityStatus;
        },
      ),
      fetchTasks: createAThunk<FetchTasksArgType, string>(
        (todoId, thunkAPI) => {
          return thunkTryCatch(thunkAPI, async () => {
            const res = await tasksApi.getTasks(todoId);
            const tasks = res.items;
            return { todoId, tasks };
          });
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todoId] = action.payload.tasks.map((t) => ({
              ...t,
              isDone: t.status === TaskStatuses.inProgress,
              entityStatus: "idle",
            }));
          },
        },
      ),
      createTask: createAThunk<CreateTaskReturnArgType, UpdateTodolistArgType>(
        (arg, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;

          return thunkTryCatch(thunkAPI, async () => {
            const res = await tasksApi.createTask(arg);
            if (res.resultCode === ResultCode.Success) {
              const task = res.data.item;
              return { task };
            } else {
              handleServerAppError(res, dispatch);
              return rejectWithValue(null);
            }
          });
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.task.todoListId].unshift({
              ...action.payload.task,
              isDone: action.payload.task.status === TaskStatuses.inProgress,
              entityStatus: "idle",
            });
          },
        },
      ),
      removeTask: createAThunk<RemoveTaskArgType, RemoveTaskArgType>(
        (arg, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          const { taskId, todoId } = arg;

          return thunkTryCatch(
            thunkAPI,
            async () => {
              const res = await tasksApi.removeTask(arg);
              if (res.resultCode === ResultCode.Success) {
                return arg;
              } else {
                handleServerAppError(res, dispatch);
                return rejectWithValue(null);
              }
            },
            { todoId, taskId },
          );
        },
        {
          fulfilled: (state, action) => {
            const index = state[action.payload.todoId].findIndex((t) => t.id === action.payload.taskId);
            if (index > -1) state[action.payload.todoId].splice(index, 1);
          },
        },
      ),
      updateTask: createAThunk<TaskResponseType, TaskPropsType>(
        (taskToUpdate, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          const task: TaskUpdateModelType = getTaskUpdateModel(taskToUpdate);
          const todoId = taskToUpdate.todoListId;
          const taskId = taskToUpdate.id;

          return thunkTryCatch(
            thunkAPI,
            async () => {
              const res = await tasksApi.updateTask({ todoId, taskId, task });

              if (res.resultCode === ResultCode.Success) {
                const updatedTask = res.data.item;
                return { ...updatedTask };
              } else {
                handleServerAppError(res, dispatch);
                return rejectWithValue(null);
              }
            },
            { todoId, taskId },
          );
        },
        {
          fulfilled: (state, action) => {
            const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.id);
            if (index > -1) {
              state[action.payload.todoListId][index] = {
                ...action.payload,
                isDone: action.payload.status === TaskStatuses.inProgress,
                entityStatus: "idle",
              };
            }
          },
        },
      ),
    };
  },

  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(todolistsActions.createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todoId];
      })
      .addCase(todolistsActions.removeAllTodolists.fulfilled, (state, action) => {
        return {};
      })
      .addCase(todolistsActions.clearTodosData, (state, action) => {
        return {};
      });
  },
  selectors: {
    selectTasks: (sliceState) => sliceState,
    selectTodoTasks: (sliceState, args: SelectTodosTasksType) => {
      const { filter, id } = args;

      let tasks = sliceState[id];
      if (filter === "active") {
        tasks = tasks.filter((t) => !t.isDone);
      }
      if (filter === "completed") {
        tasks = tasks.filter((t) => t.isDone);
      }

      return tasks;
    },
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const { selectTasks, selectTodoTasks } = slice.selectors;

export type TasksStateType = {
  [key: string]: TaskPropsType[];
};
export type TaskPropsType = TaskResponseType & { isDone: boolean; entityStatus: RequestStatusType };
type SelectTodosTasksType = {
  id: string;
  filter: FilterValueType;
};
