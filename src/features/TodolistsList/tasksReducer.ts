import { todolistsActions } from "./todolistsReducer";
import { TaskResponseType, TaskUpdateModelType, todolistAPI } from "api/todolistsApi";
import { Dispatch } from "redux";
import { AppRootStateType } from "app/store";
import { RequestStatusType, setAppStatus } from "app/appReducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    setTasks(state, action: PayloadAction<{ todoId: string; tasks: TaskResponseType[] }>) {
      state[action.payload.todoId] = action.payload.tasks.map((t) => ({
        ...t,
        isDone: t.status === TaskStatuses.inProgress,
        entityStatus: "idle",
      }));
    },
    removeTask(state, action: PayloadAction<{ todoId: string; taskId: string }>) {
      const index = state[action.payload.todoId].findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) state[action.payload.todoId].splice(index, 1);
    },
    createTask(state, action: PayloadAction<{ todoId: string; task: TaskResponseType }>) {
      state[action.payload.todoId].unshift({
        ...action.payload.task,
        isDone: action.payload.task.status === TaskStatuses.inProgress,
        entityStatus: "idle",
      });
    },
    updateTask(state, action: PayloadAction<{ todoId: string; taskId: string; task: TaskResponseType }>) {
      const index = state[action.payload.todoId].findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        state[action.payload.todoId][index] = {
          ...action.payload.task,
          isDone: action.payload.task.status === TaskStatuses.inProgress,
          entityStatus: "idle",
        };
      }
    },
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
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(todolistsActions.createTodolist, (state, action) => {
        state[action.payload.todo.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.todoId];
      })
      .addCase(todolistsActions.removeAllTodoLists, (state, action) => {
        return {};
      })
      .addCase(todolistsActions.clearTodosData, (state, action) => {
        return {};
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const { setTasks, changeTaskEntityStatus, updateTask, removeTask, createTask } = slice.actions;

export enum TaskStatuses {
  New = 0,
  inProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TasksStateType = {
  [key: string]: Array<TaskPropsType>;
};
export type TaskPropsType = TaskResponseType & { isDone: boolean; entityStatus: RequestStatusType };

// thunk creators
export const fetchTasksTC = (todoId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistAPI
      .getTasks(todoId)
      .then((data) => {
        dispatch(setTasks({ todoId, tasks: data.items }));
        dispatch(setAppStatus({ status: "succeeded" }));
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
export const removeTaskTC = (todoId: string, taskId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    dispatch(changeTaskEntityStatus({ todoId, taskId, entityStatus: "loading" }));
    todolistAPI
      .removeTask(todoId, taskId)
      .then((data) => {
        if (data.resultCode === 0) {
          dispatch(removeTask({ todoId, taskId }));
          dispatch(setAppStatus({ status: "succeeded" }));
          dispatch(changeTaskEntityStatus({ todoId, taskId, entityStatus: "succeeded" }));
        } else {
          handleServerAppError(data, dispatch);
          dispatch(changeTaskEntityStatus({ todoId, taskId, entityStatus: "failed" }));
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
export const createTaskTC = (todoId: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: "loading" }));
    todolistAPI
      .createTask(todoId, title)
      .then((data) => {
        if (data.resultCode === 0) {
          dispatch(createTask({ todoId, task: data.data.item }));
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
export const updateTaskTC = (todoId: string, taskId: string, title: string, isDone: boolean) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const tasks = getState().tasks;
    const task = tasks[todoId].find((t) => t.id === taskId);
    if (task) {
      dispatch(setAppStatus({ status: "loading" }));
      dispatch(changeTaskEntityStatus({ todoId, taskId, entityStatus: "loading" }));
      const taskModel: TaskUpdateModelType = {
        description: task.description,
        completed: task.completed,
        deadline: task.deadline,
        priority: task.priority,
        startDate: task.startDate,
        title,
        status: isDone ? TaskStatuses.inProgress : TaskStatuses.New,
      };
      todolistAPI
        .updateTask(todoId, taskId, taskModel)
        .then((data) => {
          if (data.resultCode === 0) {
            dispatch(updateTask({ todoId, taskId, task: data.data.item }));
            dispatch(setAppStatus({ status: "succeeded" }));
            dispatch(changeTaskEntityStatus({ todoId, taskId, entityStatus: "succeeded" }));
          } else {
            handleServerAppError(data, dispatch);
            dispatch(changeTaskEntityStatus({ todoId, taskId, entityStatus: "failed" }));
          }
        })
        .catch((err) => {
          handleServerNetworkError(err, dispatch);
        });
    }
  };
};
