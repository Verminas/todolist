import { todolistsActions } from "features/TodolistsList/todolistsSlice";
import {
  CreateTaskReturnArgType,
  FetchTasksArgType,
  RemoveTaskArgType,
  TaskResponseType,
  TaskUpdateModelType,
  todolistAPI,
  UpdateTodolistArgType,
} from "api/todolistsApi";
import { RequestStatusType, setAppStatus } from "app/appSlice";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { ResultCode, TaskStatuses } from "enums";

export const fetchTasks = createAppAsyncThunk<FetchTasksArgType, string>(
  "tasks/fetchTasks",
  async (todoId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistAPI.getTasks(todoId);
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todoId, tasks: res.items };
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const createTask = createAppAsyncThunk<CreateTaskReturnArgType, UpdateTodolistArgType>(
  "tasks/createTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistAPI.createTask(arg);
      if (res.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todoId: res.data.item.todoListId, task: res.data.item };
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

export const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { taskId, todoId } = arg;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      dispatch(tasksActions.changeTaskEntityStatus({ todoId, taskId, entityStatus: "loading" }));
      const res = await todolistAPI.removeTask(arg);
      if (res.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(tasksActions.changeTaskEntityStatus({ todoId, taskId, entityStatus: "succeeded" }));
        return arg;
      } else {
        handleServerAppError(res, dispatch);
        dispatch(tasksActions.changeTaskEntityStatus({ todoId, taskId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      dispatch(tasksActions.changeTaskEntityStatus({ todoId, taskId, entityStatus: "failed" }));
      return rejectWithValue(null);
    }
  },
);

export const updateTask = createAppAsyncThunk<TaskResponseType, TaskPropsType>(
  "tasks/updateTask",
  async (taskToUpdate, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      dispatch(
        tasksActions.changeTaskEntityStatus({
          todoId: taskToUpdate.todoListId,
          taskId: taskToUpdate.id,
          entityStatus: "loading",
        }),
      );
      const taskModel: TaskUpdateModelType = {
        description: taskToUpdate.description,
        completed: taskToUpdate.completed,
        deadline: taskToUpdate.deadline,
        priority: taskToUpdate.priority,
        startDate: taskToUpdate.startDate,
        title: taskToUpdate.title,
        status: taskToUpdate.isDone ? TaskStatuses.inProgress : TaskStatuses.New,
      };

      const res = await todolistAPI.updateTask({
        todoId: taskToUpdate.todoListId,
        taskId: taskToUpdate.id,
        task: taskModel,
      });

      if (res.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(
          tasksActions.changeTaskEntityStatus({
            todoId: taskToUpdate.todoListId,
            taskId: taskToUpdate.id,
            entityStatus: "succeeded",
          }),
        );
        return { ...res.data.item };
      } else {
        handleServerAppError(res, dispatch);
        dispatch(
          tasksActions.changeTaskEntityStatus({
            todoId: taskToUpdate.todoListId,
            taskId: taskToUpdate.id,
            entityStatus: "failed",
          }),
        );
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    changeTaskEntityStatus(
      state,
      action: PayloadAction<{ todoId: string; taskId: string; entityStatus: RequestStatusType }>,
    ) {
      const task = state[action.payload.todoId].find((t) => t.id === action.payload.taskId);
      if (task) task.entityStatus = action.payload.entityStatus;
    },
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
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todoId] = action.payload.tasks.map((t) => ({
          ...t,
          isDone: t.status === TaskStatuses.inProgress,
          entityStatus: "idle",
        }));
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state[action.payload.todoId].unshift({
          ...action.payload.task,
          isDone: action.payload.task.status === TaskStatuses.inProgress,
          entityStatus: "idle",
        });
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const index = state[action.payload.todoId].findIndex((t) => t.id === action.payload.taskId);
        if (index > -1) state[action.payload.todoId].splice(index, 1);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.id);
        if (index > -1) {
          state[action.payload.todoListId][index] = {
            ...action.payload,
            isDone: action.payload.status === TaskStatuses.inProgress,
            entityStatus: "idle",
          };
        }
      });
  },
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const { selectTasks } = slice.selectors;
export const tasksThunks = { fetchTasks, createTask, removeTask, updateTask };

export type TasksStateType = {
  [key: string]: Array<TaskPropsType>;
};
export type TaskPropsType = TaskResponseType & { isDone: boolean; entityStatus: RequestStatusType };
