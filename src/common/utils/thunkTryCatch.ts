import { RequestStatusType, setAppStatus } from "app/appSlice";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { AppDispatch } from "app/store";
import { GetThunkAPI } from "@reduxjs/toolkit";
import { tasksActions } from "features/TodolistsList/tasksSlice";
import { todolistsActions } from "features/TodolistsList/todolistsSlice";

// type ThunkApi = {
//   dispatch: ThunkDispatch<AppRootStateType, undefined, any>;
//   getState: () => AppRootStateType;
//   rejectWithValue: (value: any) => any;
// };

type ThunkApi = GetThunkAPI<{
  rejectValue: null;
  state?: undefined;
  dispatch?: undefined;
  extra?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
}>;

type TodolistEntity = { todoId: string };
type TaskEntity = TodolistEntity & { taskId: string };
type Entity = TodolistEntity | TaskEntity | null;

export const thunkTryCatch = async <T>(
  thunkAPI: ThunkApi,
  callbackLogic: () => Promise<T>,
  entity: Entity = null,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(setAppStatus({ status: "loading" }));
  changeEntityStatus(dispatch, entity, "loading");

  try {
    return await callbackLogic();
  } catch (err) {
    handleServerNetworkError(err, dispatch as AppDispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(setAppStatus({ status: "idle" }));
    changeEntityStatus(dispatch, entity, "idle");
  }
};

function changeEntityStatus(
  dispatch: any,
  entity: TaskEntity | TodolistEntity | null,
  entityStatus: RequestStatusType,
) {
  if (entity) {
    if ("taskId" in entity) {
      dispatch(tasksActions.changeTaskEntityStatus({ todoId: entity.todoId, taskId: entity.taskId, entityStatus }));
    } else {
      dispatch(todolistsActions.changeTodolistEntityStatus({ todoId: entity.todoId, entityStatus }));
    }
  }
}
