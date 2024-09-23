import { handleServerNetworkError } from "common/utils";
import { AppDispatch, AppRootStateType } from "app/store";
import { GetThunkAPI } from "@reduxjs/toolkit";
import { BaseResponse } from "common/types";
import { changeEntityStatus, Entity } from "common/utils";
import { appActions } from "app/appSlice";
import { ThunkDispatch } from "redux-thunk";

// type ThunkApi = {
//   dispatch: ThunkDispatch<AppRootStateType, undefined, any>;
//   getState: () => AppRootStateType;
//   rejectWithValue: (value: any) => any;
// };

type ThunkApi = GetThunkAPI<{
  rejectValue: BaseResponse | null;
  state?: undefined;
  dispatch?: undefined;
  extra?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
}>;

/**
 * Async function that encapsulates try-catch logic for error handling in Redux thunks.
 *
 * @template T - The type of the result returned by the callbackLogic function.
 *
 * @param {ThunkApi} thunkAPI - The ThunkApi object containing dispatch and rejectWithValue functions.
 * @param {() => Promise<T>} callbackLogic - The asynchronous callback function to execute.
 * @param {Entity} [entity=null] - The entity associated with the operation, default is null.
 *
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - A promise resolving to the result of the callbackLogic function or a rejection value.
 */

export const thunkTryCatch = async <T>(
  thunkAPI: ThunkApi,
  callbackLogic: () => Promise<T>,
  entity: Entity = null,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  changeEntityStatus(dispatch, entity, "loading");

  try {
    return await callbackLogic();
  } catch (err) {
    handleServerNetworkError(err, dispatch as AppDispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }));
    changeEntityStatus(dispatch, entity, "idle");
  }
};
