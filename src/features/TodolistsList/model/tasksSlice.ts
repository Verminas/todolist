import { FilterValueType, todolistsActions } from "features/TodolistsList/model/todolistsSlice";
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
import { getTaskUpdateModel } from "common/utils";
import { tasksApi } from "features/TodolistsList/api/tasksApi";

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null | BaseResponse | unknown }>();
    return {
      changeTaskEntityStatus: creators.reducer(
        (state, action: PayloadAction<{ todoId: string; taskId: string; entityStatus: RequestStatusType }>) => {
          const task = state[action.payload.todoId].find((t) => t.id === action.payload.taskId);
          if (task) task.entityStatus = action.payload.entityStatus;
        },
      ),
      fetchTasks: createAThunk<FetchTasksArgType, string>(
        async (todoId, thunkAPI) => {
          const res = await tasksApi.getTasks(todoId);
          const tasks = res.items;
          return { todoId, tasks };
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
        async (arg, thunkAPI) => {
          const { rejectWithValue } = thunkAPI;

          const res = await tasksApi.createTask(arg);
          if (res.resultCode === ResultCode.Success) {
            const task = res.data.item;
            return { task };
          } else {
            return rejectWithValue(res);
          }
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
        async (arg, thunkAPI) => {
          const { rejectWithValue } = thunkAPI;

          const res = await tasksApi.removeTask(arg);
          if (res.resultCode === ResultCode.Success) {
            return arg;
          } else {
            return rejectWithValue(res);
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state[action.payload.todoId].findIndex((t) => t.id === action.payload.taskId);
            if (index > -1) state[action.payload.todoId].splice(index, 1);
          },
          pending: (state, action) => {
            const { taskId, todoId } = action.meta.arg;
            const task = state[todoId].find((t) => t.id === taskId);
            if (task) task.entityStatus = "loading";
          },
          rejected: (state, action) => {
            const { taskId, todoId } = action.meta.arg;
            const task = state[todoId].find((t) => t.id === taskId);
            if (task) task.entityStatus = "failed";
          },
        },
      ),
      updateTask: createAThunk<TaskResponseType, TaskPropsType>(
        async (taskToUpdate, thunkAPI) => {
          const { rejectWithValue } = thunkAPI;
          const task: TaskUpdateModelType = getTaskUpdateModel(taskToUpdate);
          const todoId = taskToUpdate.todoListId;
          const taskId = taskToUpdate.id;

          const res = await tasksApi.updateTask({ todoId, taskId, task });

          if (res.resultCode === ResultCode.Success) {
            const updatedTask = res.data.item;
            return { ...updatedTask };
          } else {
            return rejectWithValue(res);
          }
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
          pending: (state, action) => {
            const { todoListId, id } = action.meta.arg;
            const task = state[todoListId].find((t) => t.id === id);
            if (task) task.entityStatus = "loading";
          },
          rejected: (state, action) => {
            const { todoListId, id } = action.meta.arg;
            const task = state[todoListId].find((t) => t.id === id);
            if (task) task.entityStatus = "failed";
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
    selectTasks: (sliceState, args: SelectTodosTasksType) => {
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
export const { selectTasks } = slice.selectors;

export type TasksStateType = {
  [key: string]: TaskPropsType[];
};
export type TaskPropsType = TaskResponseType & { isDone: boolean; entityStatus: RequestStatusType };
type SelectTodosTasksType = {
  id: string;
  filter: FilterValueType;
};
