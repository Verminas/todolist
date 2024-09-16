import { RequestStatusType, setAppStatus } from "app/appSlice";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { AppDispatch } from "app/store";
import { GetThunkAPI } from "@reduxjs/toolkit";
import { tasksActions } from "features/TodolistsList/tasksSlice";
import { todolistsActions, TodolistType } from "features/TodolistsList/todolistsSlice";

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
type TodolistsEntity = { todolists: TodolistType[] };
type TaskEntity = TodolistEntity & { taskId: string };
type Entity = TodolistEntity | TaskEntity | TodolistsEntity | null;

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

function changeEntityStatus(dispatch: any, entity: Entity, entityStatus: RequestStatusType): void {
  if (entity) {
    if ("todolists" in entity) {
      entity.todolists.forEach((tl) =>
        dispatch(
          todolistsActions.changeTodolistEntityStatus({
            todoId: tl.id,
            entityStatus,
          }),
        ),
      );
    } else {
      if ("taskId" in entity) {
        dispatch(tasksActions.changeTaskEntityStatus({ todoId: entity.todoId, taskId: entity.taskId, entityStatus }));
      } else {
        dispatch(todolistsActions.changeTodolistEntityStatus({ todoId: entity.todoId, entityStatus }));
      }
    }
  }
}
